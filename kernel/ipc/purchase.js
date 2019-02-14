const debug = require('debug')('afm:kernel:lib:actionCreators:purchase')

const araUtil = require('ara-util')
const { internalEmitter } = require('electron-window-manager')
const { ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const { events: k } = require('k')
const windowManager = require('electron-window-manager')

const { acmManager } = require('../daemons')
const { fileDescriptor: descriptorGeneration } = require('../util')
const dispatch = require('../state/dispatch')
const {
	account,
	farmer,
	files
} = windowManager.sharedData.fetch('store')

internalEmitter.on(k.OPEN_DEEPLINK, async (load) => {
	try {
		debug('%s heard', k.OPEN_DEEPLINK)
		dispatch({ type: k.OPEN_DEEPLINK, load })
		if (account.userDID == null) { throw new Error('Not logged in') }
		if (load == null ) { throw new Error('Broken link') }
		internalEmitter.emit(k.PROMPT_PURCHASE, load)
	} catch(err) {
		errorHandler(err)
	}
})

internalEmitter.on(k.PROMPT_PURCHASE, async (load) => {
	try {
		debug('%s heard', k.PROMPT_PURCHASE)
		dispatch({ type: k.DUMP_DEEPLINK_DATA })
		dispatch({ type: k.FEED_MODAL, load })

		windowManager.openWindow('purchaseEstimate')
		const library = await acmManager.getLibraryItems(account.userDID)
		const isOwner = !isDev && files.published.find(({ did }) => did === load.did)
		if (library.includes('0x' + araUtil.getIdentifier(load.did)) || isOwner) {
			debug('already own item')
			dispatch({ type: k.FEED_MODAL, load: { modalName: isOwner ? 'packageOwner' : 'alreadyOwn' } })
			windowManager.openModal('generalMessageModal')
			windowManager.close('purchaseEstimate')
			return
		}

		// get peer count estimate
		farmer.farm.dryRunJoin({ did: load.did })

		const price = await acmManager.getAFSPrice({ did: load.did })
		const fee = acmManager.getPurchaseFee(price)
		const gasEstimate = Number(await acmManager.purchaseEstimate({
			contentDID: load.did,
			password: account.password,
			userDID: account.userDID,
		}))
		windowManager.pingView({
			view: 'purchaseEstimate',
			event: k.REFRESH,
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

ipcMain.on(k.CONFIRM_PURCHASE, async (event, load) => {
	const { autoQueue } = account
	debug('%s heard: %s', k.CONFIRM_PURCHASE, load.did)
	try {
		if (account.ethBalance < load.gasEstimate) {
			throw new Error('Not enough eth')
		}

		if (account.araBalance < load.price + load.fee) { throw new Error('Not enough Ara') }

		const descriptorOpts = {
			peers: 1,
			name: load.fileName,
			status: k.PURCHASING,
		}
		const descriptor = await descriptorGeneration.makeDescriptor(load.did, descriptorOpts)
		dispatch({ type: k.PURCHASING, load: descriptor })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

		const itemLoad = { contentDID: load.did, password: account.password, userDID: account.userDID }

		const jobId = await autoQueue.push(() => acmManager.purchaseItem(itemLoad))

		const araBalance = await acmManager.getAraBalance(account.userDID)
		dispatch({ type: k.PURCHASED, load: { araBalance, jobId, did: load.did } })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

		dispatch({ type: k.FEED_MODAL, load: {
				modalName: 'startDownload',
				callback: () => {
					internalEmitter.emit(k.DOWNLOAD, load)
				}
			}
		})
		windowManager.openModal('generalActionModal')



		const rewardsSub = await acmManager.subscribeRewardsAllocated(load.did, account.accountAddress, account.userDID)
		const updateSub = await acmManager.subscribeAFSUpdates(load.did)

		dispatch({ type: k.GOT_PURCHASED_SUBS, load: { rewardsSub, updateSub } })
	} catch (err) {
		errorHandler(err)
		dispatch({ type: k.ERROR_PURCHASING, load: { did: load.did } })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
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
	dispatch({ type: k.FEED_MODAL, load: { modalName, callback } })
	windowManager.openModal('generalMessageModal')
}
