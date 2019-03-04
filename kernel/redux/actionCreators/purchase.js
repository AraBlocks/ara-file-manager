const debug = require('debug')('afm:kernel:lib:actionCreators:purchase')

const araUtil = require('ara-util')
const { internalEmitter } = require('electron-window-manager')
const { ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const { events } = require('k')
const windowManager = require('electron-window-manager')

const { act, descriptorGeneration } = require('../../daemons')
const dispatch = require('../reducers/dispatch')

const {
	account,
	farmer,
	files
} = windowManager.sharedData.fetch('store')

internalEmitter.on(events.OPEN_DEEPLINK, async (load) => {
	try {
		debug('%s heard', events.OPEN_DEEPLINK)
		dispatch({ type: events.OPEN_DEEPLINK, load })
		if (account.userDID == null) { throw new Error('Not logged in') }
		if (load == null ) { throw new Error('Broken link') }
		internalEmitter.emit(events.PROMPT_PURCHASE, load)
	} catch(err) {
		errorHandler(err)
	}
})

internalEmitter.on(events.PROMPT_PURCHASE, async (load) => {
	try {
		debug('%s heard', events.PROMPT_PURCHASE)
		dispatch({ type: events.DUMP_DEEPLINK_DATA })
		dispatch({ type: events.FEED_MODAL, load })

		windowManager.openWindow('purchaseEstimate')
		const library = await act.getLibraryItems(account.userDID)
		const isOwner = !isDev && files.published.find(({ did }) => did === load.did)
		if (library.includes('0x' + araUtil.getIdentifier(load.did)) || isOwner) {
			debug('already own item')
			dispatch({ type: events.FEED_MODAL, load: { modalName: isOwner ? 'packageOwner' : 'alreadyOwn' } })
			windowManager.openModal('generalMessageModal')
			windowManager.close('purchaseEstimate')
			return
		}

		// get peer count estimate
		farmer.farm.dryRunJoin({ did: load.did })

		const price = await act.getAFSPrice({ did: load.did })
		const fee = act.getPurchaseFee(price)
		const gasEstimate = Number(await act.purchaseEstimate({
			contentDID: load.did,
			password: account.password,
			userDID: account.userDID,
		}))
		windowManager.pingView({
			view: 'purchaseEstimate',
			event: events.REFRESH,
			load: {
				fee,
				peers: 1,
				gasEstimate,
				price: Number(price)
			}
		})

	} catch (err) {
		errorHandler(err)
	}
})

ipcMain.on(events.CONFIRM_PURCHASE, async (event, load) => {
	const { autoQueue } = account
	debug('%s heard: %s', events.CONFIRM_PURCHASE, load.did)
	try {
		if (account.ethBalance < load.gasEstimate) {
			throw new Error('Not enough eth')
		}

		if (account.araBalance < load.price + load.fee) { throw new Error('Not enough Ara') }

		const descriptorOpts = {
			peers: 1,
			name: load.fileName,
			status: events.PURCHASING,
		}
		const descriptor = await descriptorGeneration.makeDescriptor(load.did, descriptorOpts)
		dispatch({ type: events.PURCHASING, load: descriptor })
		windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

		const itemLoad = { contentDID: load.did, password: account.password, userDID: account.userDID }

		const jobId = await autoQueue.push(() => act.purchaseItem(itemLoad))

		const araBalance = await act.getAraBalance(account.userDID)
		dispatch({ type: events.PURCHASED, load: { araBalance, jobId, did: load.did } })
		windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

		dispatch({ type: events.FEED_MODAL, load: {
				modalName: 'startDownload',
				callback: () => {
					internalEmitter.emit(events.DOWNLOAD, load)
				}
			}
		})
		windowManager.openModal('generalActionModal')

		const rewardsSub = await act.subscribeRewardsAllocated(load.did, account.accountAddress, account.userDID)
		const updateSub = await act.subscribeAFSUpdates(load.did)

		dispatch({ type: events.GOT_PURCHASED_SUBS, load: { rewardsSub, updateSub } })
	} catch (err) {
		errorHandler(err)
		dispatch({ type: events.ERROR_PURCHASING, load: { did: load.did } })
		windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
	}
})

function errorHandler(err) {
	debug(err)
	let modalName
	let callback = () => {}
	switch(err.message) {
		case 'Not enough eth':
			modalName = 'notEnoughEth'
			break
		case 'Not enough Ara':
			modalName = 'notEnoughAra'
			break
		case 'Not logged in':
			modalName = 'notLoggedIn'
			callback = () => windowManager.openWindow('login')
			break
		case 'Broken link':
			modalName = 'brokenLink'
			break
		default:
			modalName = 'purchaseFailed'
			break
	}
	dispatch({ type: events.FEED_MODAL, load: { modalName, callback } })
	windowManager.openModal('generalMessageModal')
	internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, false)
}
