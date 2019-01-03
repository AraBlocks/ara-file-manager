'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:purchase')
const dispatch = require('../reducers/dispatch')
const { acmManager, descriptorGeneration } = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const araUtil = require('ara-util')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

internalEmitter.on(k.OPEN_DEEPLINK, async (load) => {
	debug('%s heard', k.OPEN_DEEPLINK)
	dispatch({ type: k.OPEN_DEEPLINK, load })
	if (account.userDID == null) {
		debug('not logged in')
		dispatch({ type: k.FEED_MODAL, load: { modalName: 'notLoggedIn' } })
		windowManager.openModal('generalMessageModal')
		return
	}
	internalEmitter.emit(k.PROMPT_PURCHASE, load)
})

internalEmitter.on(k.PROMPT_PURCHASE, async (load) => {
	try {
		debug('%s heard', k.PROMPT_PURCHASE)
		dispatch({ type: k.DUMP_DEEPLINK_DATA })
		dispatch({ type: k.FEED_MODAL, load })

		windowManager.openWindow('purchaseEstimate')
		const library = await acmManager.getLibraryItems(account.userDID)
		if (library.includes('0x' + araUtil.getIdentifier(load.did))) {
			debug('already own item')
			dispatch({ type: k.FEED_MODAL, load: { modalName: 'alreadyOwn' } })
			windowManager.openModal('generalMessageModal')
			windowManager.close('purchaseEstimate')
			return
		}

		const price = Number(await acmManager.getAFSPrice({ did: load.did }))
		const gasEstimate = Number(await acmManager.purchaseEstimate({
			contentDID: load.did,
			password: account.password,
			userDID: account.userDID,
		}))

		windowManager.pingView({ view: 'purchaseEstimate', event: k.REFRESH, load: { gasEstimate, price } })
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

		dispatch({ type: k.FEED_MODAL, load: {
				modalName: 'startDownload',
				callback: () => {
					internalEmitter.emit(k.DOWNLOAD, load)
				}
			}
		})
		windowManager.openModal('generalActionModal')

		internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)

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
	err.message === 'Not enough eth'
		? dispatch({ type: k.FEED_MODAL, load: { modalName: 'notEnoughEth' } })
		: dispatch({ type: k.FEED_MODAL, load: { modalName: 'purchaseFailed' } })
	windowManager.openModal('generalMessageModal')
	internalEmitter.emit(k.CHANGE_PENDING_PUBLISH_STATE, false)
}