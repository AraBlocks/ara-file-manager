'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:purchase')
const dispatch = require('../reducers/dispatch')
const {
	utils: actionsUtil,
	araContractsManager,
} = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const araUtil = require('ara-util')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

internalEmitter.on(k.OPEN_DEEPLINK, async (load) => {
	debug('%s heard', k.OPEN_DEEPLINK)
	dispatch({ type: k.OPEN_DEEPLINK, load })
	if (account.userAid == null) {
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
		const library = await araContractsManager.getLibraryItems(account.userAid)
		if (library.includes('0x' + araUtil.getIdentifier(load.did))) {
			debug('already own item')
			dispatch({ type: k.FEED_MODAL, load: { modalName: 'alreadyOwn' } })
			windowManager.openModal('generalMessageModal')
			windowManager.close('purchaseEstimate')
			return
		}

		if (account.pendingTransaction) {
			debug('pending transaction')
			dispatch({ type: k.FEED_MODAL, load: { modalName: 'pendingTransaction' } })
			windowManager.openModal('generalMessageModal')
			return
		}

		const price = Number(await araContractsManager.getAFSPrice({ did: load.did }))
		const gasEstimate = Number(await araContractsManager.purchaseEstimate({
			contentDID: load.did,
			password: account.password,
			userDID: account.userAid,
		}))

		windowManager.pingView({ view: 'purchaseEstimate', event: k.REFRESH, load: { gasEstimate, price } })
	} catch (err) {
		errorHandler(err)
	}
})

ipcMain.on(k.CONFIRM_PURCHASE, async (event, load) => {
	debug('%s heard: %s', k.CONFIRM_PURCHASE, load.did)
	try {
		internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, true)
		const descriptorOpts = {
			peers: 1,
			name: load.fileName,
			status: k.PURCHASING,
		}
		const descriptor = await actionsUtil.descriptorGenerator(load.did, descriptorOpts)
		dispatch({ type: k.PURCHASING, load: descriptor })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

		const jobId = await araContractsManager.purchaseItem({
			contentDID: load.did,
			password: account.password,
			userDID: account.userAid
		})

		const araBalance = await araContractsManager.getAraBalance(account.userAid)
		dispatch({ type: k.PURCHASED, load: { araBalance, jobId, did: load.did } })

		internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)

		const rewardsSub = await araContractsManager.subscribeRewardsAllocated(load.did, account.accountAddress, account.userAid)
		dispatch({ type: k.GOT_REWARDS_SUB, load: { rewardsSub } })
	} catch (err) {
		errorHandler(err)
		dispatch({ type: k.ERROR_PURCHASING, load: { did: load.did } })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
	}
})

function errorHandler(err) {
	debug(err)
	dispatch({ type: k.FEED_MODAL, load: { modalName: 'purchaseFailed' } })
	windowManager.openModal('generalMessageModal')
	internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
}