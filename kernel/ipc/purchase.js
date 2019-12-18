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
  application,
	account,
	farmer,
  modal,
	files
} = windowManager.sharedData.fetch('store')

const GAS_TIMEOUT = 60000

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
	debug('%s heard', events.PURCHASE, load)
	try {
    errored = false
    approved = false
    purchased = false
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
  if (!('purchase' === step || 'approve' === step))
    return

  debug('%s heard', events.GAS_PRICE, load)

  load = Object.assign(load, modal.purchaseFileData)
  try {
    dispatch({ type: events.DUMP_DEEPLINK_DATA })
    dispatch({ type: events.FEED_MODAL, load })

    windowManager.openWindow('purchaseEstimate')
    const library = await act.getLibraryItems(account.userDID)
    const isOwner = files.published.find(({ did }) => did === load.did)
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
  const {
    gasEstimate,
    gasPrice,
    fileName,
    price,
    step,
    fee,
    did
  } = load
	debug('%s heard:', events.CONFIRM_PURCHASE, load)
	analytics.trackPurchaseStart()
	try {
		if (account.ethBalance < gasEstimate) {
			throw new Error('Not enough eth')
		}

		if (account.araBalance < price + fee) { throw new Error('Not enough Ara') }

		const descriptorOpts = {
			peers: 1,
			name: fileName,
			status: events.PURCHASING,
		}
		const descriptor = await descriptorGeneration.makeDescriptor(did, descriptorOpts)
		dispatch({ type: events.PURCHASING, load: descriptor })
		windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

    this.startTimer = (progressStep) => {
      setTimeout(
        () => {
          let trigger = false
          let type
          let view
          switch (progressStep) {
            case 'retryStepOne':
              trigger = !(approved || errored)
              type = events.TWO_STEP_PROGRESS
              view = 'twoStepProgressModal'
              break
            case 'retryStepTwo':
              trigger = !(purchased || errored)
              type = events.TWO_STEP_PROGRESS
              view = 'twoStepProgressModal'
              break
            case 'retryPurchase':
              trigger = !(purchased || errored)
              type = events.ONE_STEP_PROGRESS
              view = 'oneStepProgressModal'
              break
          }
          debug('timeout', trigger)
          if (trigger) {
            dispatch({ type, load: { step: progressStep } })
            windowManager.pingView({ view, event: events.REFRESH })
          }
        }, GAS_TIMEOUT
      )
    }

		const itemLoad = {
      contentDID: did,
      password: account.password,
      userDID: account.userDID,
      gasPrice: gasPrice,
      approveCallbacks: {
        onhash: hash => {
          debug('approve tx hash: %s', hash)
          dispatch({
            type: events.TWO_STEP_PROGRESS,
            load: {
              modalName: 'Purchasing',
              stepOneHash: hash,
              step: 'stepOne',
              network: application.network,
              retryEvent: events.PURCHASE_NEW_GAS,
              stepNames: {
                1: 'Approving',
                2: 'Purchasing'
              }
            }})
          windowManager.openModal('twoStepProgressModal')
        },
        onreceipt: receipt => {
          debug('approve tx receipt:', receipt)
          approved = true
          this.startTimer('retryStepTwo')
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
          windowManager.closeModal('twoStepProgressModal')
          windowManager.openModal('generalActionModal')
        }
      },
      purchaseCallbacks: {
        onhash: hash => {
          debug('purchase tx hash: %s', hash)
          if (0 < price) {
            const load = {
              stepTwoHash: hash,
              step: 'stepTwo',
              network: application.network,
              retryEvent: events.PURCHASE_NEW_GAS
            }
            dispatch({ type: events.TWO_STEP_PROGRESS, load })
            windowManager.pingView({ view: 'twoStepProgressModal', event: events.REFRESH, load })
          } else {
            approved = true
            const load = {
              modalName: 'Purchasing',
              hash,
              network: application.network,
              retryEvent: events.PURCHASE_NEW_GAS,
              stepName: 'Purchasing'
            }
            dispatch({ type: events.ONE_STEP_PROGRESS, load })
            windowManager.openModal('oneStepProgressModal')
          }
        },
        onreceipt: receipt => {
          debug('purchase tx receipt:', receipt)
          purchased = true
          0 < price ? windowManager.closeModal('twoStepProgressModal') : windowManager.closeModal('oneStepProgressModal')
        },
        onerror: error => {
          debug('purchase tx error:', error)
          errored = true
          0 < price ? windowManager.closeModal('twoStepProgressModal') : windowManager.closeModal('oneStepProgressModal')
        }
      }
    }

    let jobId = null
    if ('approve' === step && 0 < price) {
      autoQueue.clear()
      this.startTimer('retryStepOne');
  		([jobId] = await autoQueue.push(
  			() => act.purchaseItem(itemLoad),
  			analytics.trackPurchaseFinish
  		))
    } else {
      autoQueue.clear()
      this.startTimer('retryPurchase');
      ([jobId] = await autoQueue.push(
        () => act.purchaseItem(Object.assign(itemLoad, { approve: false })),
        analytics.trackPurchaseFinish
      ))
    }

    if (approved && purchased) {
  		const araBalance = await act.getAraBalance(account.userDID)
  		dispatch({ type: events.PURCHASED, load: { araBalance, jobId, did: did } })
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

  		const rewardsSub = await act.subscribeRewardsAllocated(did, account.accountAddress, account.userDID)
  		const updateSub = await act.subscribeAFSUpdates(did)

  		dispatch({ type: events.GOT_PURCHASED_SUBS, load: { rewardsSub, updateSub } })
    }
	} catch (err) {
    debug('Err in %s: %o', 'purchase', err)
		dispatch({ type: events.ERROR_PURCHASING, load: { did } })
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
