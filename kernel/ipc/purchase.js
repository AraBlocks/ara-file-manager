const debug = require('debug')('ara:fm:kernel:ipc:purchase')

const araUtil = require('ara-util')
const { internalEmitter } = require('electron-window-manager')
const { ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const { events } = require('k')
const windowManager = require('electron-window-manager')

const { act, analytics, descriptorGeneration, utils } = require('../daemons')
const dispatch = require('../redux/reducers/dispatch')

const {
	account,
	farmer,
  modal,
	files
} = windowManager.sharedData.fetch('store')

const GAS_TIMEOUT = 25000

let errored = false
let approved = false
let purchased = false

internalEmitter.on(events.OPEN_DEEPLINK, async (load) => {
	try {
		debug('%s heard', events.OPEN_DEEPLINK)
		dispatch({ type: events.OPEN_DEEPLINK, load })
		if (account.userDID == null) { throw new Error('Not logged in') }
		if (load == null) { throw new Error('Broken link') }
		internalEmitter.emit(events.PURCHASE, load)
	} catch (err) {
		errorHandler(err)
	}
})

internalEmitter.on(events.PURCHASE, async (load) => {
	try {
		debug('%s heard', events.PURCHASE, load)
    dispatch({ type: events.FEED_MODAL, load: { modalName: 'suggestingGasPrices' } })
    windowManager.openModal('generalPleaseWaitModal')

    const { did, fileName, author } = load

    const gasPrice = await utils.requestGasPrice()
    const { average, fast, fastest } = gasPrice
    dispatch({ type: events.PURCHASE_FILE_LOAD, load: { did, fileName, author } })
    dispatch({ type: events.SET_GAS_PRICE, load: { average: Number(average)/10, fast: Number(fast)/10, fastest: Number(fastest)/10, step: 'approve' } })

    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.openModal('setGasModal')
	} catch (err) {
    debug('Error for %s: %o', 'newestimate', err)
    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.closeModal('setGasModal')
		errorHandler(err)
	}
})

internalEmitter.on(events.PURCHASE_NEW_GAS, async (_, { step }) => {
  await _onNewGas(step)
})

ipcMain.on(events.PURCHASE_NEW_GAS, async (_, { step }) => {
  await _onNewGas(step)
})

async function _onNewGas(step) {
  debug('%s heard', events.PURCHASE_NEW_GAS)
  dispatch({ type: events.FEED_MODAL, load: { modalName: 'suggestingGasPrices' } })
  windowManager.openModal('generalPleaseWaitModal')
  const gasPrice = await utils.requestGasPrice()
  const { average, fast, fastest } = gasPrice
  dispatch({ type: events.SET_GAS_PRICE, load: { average: Number(average)/10, fast: Number(fast)/10, fastest: Number(fastest)/10, step } })
  windowManager.closeModal('generalPleaseWaitModal')
  windowManager.openModal('setGasModal')
}

ipcMain.on(events.GAS_PRICE, async(_, load) => {
  const { step, gasPrice } = load
  if (!('purchase' === step || 'approve' === step)) return

  debug('%s heard', events.GAS_PRICE, load)

  load = Object.assign(load, modal.purchaseFileData)
  try {
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
    //farmer.farm.dryRunJoin({ did: load.did })

    const price = await act.getAFSPrice({ did: load.did })
    const fee = act.getPurchaseFee(price)
    const gasEstimate = Number(await act.purchaseEstimate({
      contentDID: load.did,
      password: account.password,
      userDID: account.userDID,
      gasPrice
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
    debug('Error for %s: %o', 'newestimate', err)
    errorHandler(err)
  }
})

ipcMain.on(events.CONFIRM_PURCHASE, async (_, load) => {
	const { autoQueue } = account
  const { step } = load
	debug('%s heard:', events.CONFIRM_PURCHASE, load)
	analytics.trackPurchaseStart()
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

    this.startTimer = (_) => {
      setTimeout(
        () => {
          let trigger = false
          switch (_) {
            case 'retryapprove':
              trigger = !(approved || errored)
              break
            case 'retrypurchase':
              trigger = !(purchased || errored)
              break
          }
          debug('timeout', trigger)
          if (trigger) {
            dispatch({ type: events.PURCHASE_PROGRESS, load: { step: _ } })
            windowManager.pingView({ view: 'purchaseProgressModal', event: events.REFRESH })
          }
        }, GAS_TIMEOUT
      )
    }

		const itemLoad = {
      contentDID: load.did,
      password: account.password,
      userDID: account.userDID,
      approveCallbacks: {
        onhash: hash => {
          debug('approve tx hash: %s', hash)
          dispatch({ type: events.PURCHASE_PROGRESS, load: { approveHash: hash, step: 'approve' }})
          windowManager.openModal('purchaseProgressModal')
        },
        onreceipt: receipt => {
          debug('approve tx receipt:', receipt)
          approved = true
          this.startTimer('retrypurchase')
        },
        onerror: error => {
          debug('approve tx error:', error)
          errored = true
          dispatch({ type: events.FEED_MODAL,
            load: {
              modalName: 'transactionError',
              callback: () => {
                internalEmitter.emit(events.PURCHASE_NEW_GAS, true, { step: 'approve' })
              }
            }
          })
          windowManager.closeModal('purchaseProgressModal')
          windowManager.openModal('generalActionModal')
        }
      },
      purchaseCallbacks: {
        onhash: hash => {
          debug('purchase tx hash: %s', hash)
          dispatch({ type: events.PURCHASE_PROGRESS, load: { purchaseHash: hash, step: 'purchase' } })
          windowManager.pingView({ view: 'purchaseProgressModal', event: events.REFRESH, load: { purchaseHash: hash, step: 'purchase' } })
        },
        onreceipt: receipt => {
          debug('purchase tx receipt:', receipt)
          purchased = true
          windowManager.closeModal('purchaseProgressModal')
        },
        onerror: error => {
          debug('purchase tx error:', error)
          errored = true
          windowManager.closeModal('purchaseProgressModal')
        }
      },
      gasPrice: load.gasPrice
    }

    let jobId = null
    if ('approve' === step) {
      autoQueue.clear()
      this.startTimer('retryapprove');
  		([jobId] = await autoQueue.push(
  			() => act.purchaseItem(itemLoad),
  			analytics.trackPurchaseFinish
  		))
    } else if ('purchase' === step) {
      autoQueue.clear()
      this.startTimer('retrypurchase');
      ([jobId] = await autoQueue.push(
        () => act.purchaseItem(Object.assign(itemLoad, { approve: false })),
        analytics.trackPurchaseFinish
      ))
    }

    if (approved && purchased) {
  		const araBalance = await act.getAraBalance(account.userDID)
  		dispatch({ type: events.PURCHASED, load: { araBalance, jobId, did: load.did } })
  		windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

  		dispatch({
  			type: events.FEED_MODAL, load: {
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
    }
	} catch (err) {
    debug('Err in %s: %o', 'purchase', err)
		dispatch({ type: events.ERROR_PURCHASING, load: { did: load.did } })
		windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
	}
})

function errorHandler(err) {
	debug(err)
	let modalName
	let callback = () => { }
	switch (err.message) {
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
