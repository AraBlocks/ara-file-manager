'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:purchase')
const dispatch = require('../reducers/dispatch')
const {
	utils: actionsUtil,
	araContractsManager,
} = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

internalEmitter.on(k.PROMPT_PURCHASE, async (load) => {
	try {
		debug('%s heard. Load: %o', k.PROMPT_PURCHASE, load)
		if (account.userAid == null) {
			debug('not logged in')
			dispatch({ type: k.FEED_MODAL, load: { modalName: 'notLoggedIn' } })
			windowManager.openModal('generalMessageModal')
			return
		}
		const library = await araContractsManager.getLibraryItems(account.userAid)
		if (library.includes('0x' + load.aid.slice(-64))) {
			debug('already own item')
			dispatch({ type: k.FEED_MODAL, load: { modalName: 'alreadyOwn' } })
			windowManager.openModal('generalMessageModal')
			return
		}

		if (account.pendingTransaction) {
			debug('pending transaction')
			dispatch({ type: k.FEED_MODAL, load: { modalName: 'pendingTransaction' } })
			windowManager.openModal('generalMessageModal')
			return
		}

		const price = await araContractsManager.getAFSPrice({ did: load.aid })
		dispatch({ type: k.FEED_MODAL, load: { price, ...load } })
		windowManager.openModal('checkoutModal1')
	} catch (err) {
		debug('Error: %O', err)
		dispatch({ type: k.FEED_MODAL, load: { modalName: 'failureModal2' } })
		windowManager.openModal('generalMessageModal')
	}
})

ipcMain.on(k.PURCHASE, async (event, load) => {
	debug('%s heard: %s', k.PURCHASE, load.did)
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

		const jobId  = await araContractsManager.purchaseItem(load.did)
		const araBalance = await araContractsManager.getAraBalance(account.userAid)
		dispatch({ type: k.PURCHASED, load: { araBalance, jobId, did: load.did } })
		internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)

		const rewardsSub = await araContractsManager.subscribeRewardsAllocated(load.did, account.accountAddress, account.userAid)
		dispatch({ type: k.GOT_REWARDS_SUB, load: { rewardsSub } })
	} catch (err) {
		debug(err)
		dispatch({ type: k.FEED_MODAL, load: { modalName: 'failureModal2' } })
		windowManager.openModal('generalMessageModal')
		internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
	}
})
