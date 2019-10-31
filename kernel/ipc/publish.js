const debug = require('debug')('ara:fm:kernel:ipc:publish')

const araFilesystem = require('ara-filesystem')
const { ipcMain } = require('electron')
const { events, networkKeys } = require('k')
const fs = require('fs')
const windowManager = require('electron-window-manager')

const {
  afs,
  act,
  analytics,
  utils: daemonsUtil,
  descriptorGeneration
} = require('../daemons')
const dispatch = require('../redux/reducers/dispatch')

const { internalEmitter } = windowManager
const store = windowManager.sharedData.fetch('store')

const GAS_TIMEOUT = 25000

let errored = false
let deployed = false
let priced = false
let written = false

ipcMain.on(events.OPEN_MANAGE_FILE_VIEW, _feedManageFile)
internalEmitter.on(events.OPEN_MANAGE_FILE_VIEW, (load) => _feedManageFile(null, load))

ipcMain.on(events.PUBLISH, async (_, { name, paths, price }) => {
  debug('%s heard', events.PUBLISH)
  const { password, userDID } = store.account
  try {
    errored = false
    deployed = false
    priced = false
    written = false
    dispatch({ type: events.FEED_MODAL, load: { modalName: 'suggestingGasPrices' } })
    windowManager.openModal('generalPleaseWaitModal')
    let { afs, afs: { did }, mnemonic } = await araFilesystem.create({ owner: userDID, password })
    await (await araFilesystem.add({ did, paths, password })).close()
    await afs.close()

    const size = paths.reduce((sum, file) => sum += fs.statSync(file).size, 0)
    await daemonsUtil.writeFileMetaData({ did, size, title: name, password })

    const gasPrice = await daemonsUtil.requestGasPrice()
    const { average, fast, fastest } = gasPrice
    dispatch({ type: events.PUBLISH_FILE_LOAD, load: { name, paths, price, did, mnemonic, size } })
    dispatch({ type: events.SET_GAS_PRICE, load: { average: Number(average)/10, fast: Number(fast)/10, fastest: Number(fastest)/10 } })
    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.openModal('setGasModal')
  } catch (err) {
    debug('Error for %s: %o', 'newestimate', err)
    internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, false)
    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.closeModal('setGasModal')
    errorHandling(err)
  }
})

internalEmitter.on(events.PUBLISH_NEW_GAS, async (_, { step }) => {
  await _onNewGas(step)
})

ipcMain.on(events.PUBLISH_NEW_GAS, async (_, { step }) => {
  await _onNewGas(step)
})

async function _onNewGas(step) {
  debug('%s heard', events.PUBLISH_NEW_GAS)
  dispatch({ type: events.FEED_MODAL, load: { modalName: 'suggestingGasPrices' } })
  windowManager.openModal('generalPleaseWaitModal')
  const gasPrice = await daemonsUtil.requestGasPrice()
  const { average, fast, fastest } = gasPrice
  dispatch({ type: events.SET_GAS_PRICE, load: { average: Number(average)/10, fast: Number(fast)/10, fastest: Number(fastest)/10, step } })
  windowManager.closeModal('generalPleaseWaitModal')
  windowManager.openModal('setGasModal')
}

ipcMain.on(events.GAS_PRICE, async(_, { gasPrice, step = 'publish' }) => {
  if (!('publish' === step || 'deploy' === step || 'write' === step || 'price' === step)) return

  debug('%s heard', events.GAS_PRICE, step)

  const { name, paths, price, did, mnemonic, size } = store.modal.publishFileData
  const { password, userDID } = store.account
  try {
    dispatch({ type: events.FEED_MODAL, load: { modalName: 'publishEstimate' } })
    windowManager.openModal('generalPleaseWaitModal')

    const gasEstimate = Number(await araFilesystem.commit({
      did,
      estimate: true,
      estimateDid: networkKeys.ESTIMATE_PROXY_DID,
      password,
      gasPrice,
      price: Number(price)
    }))
    const ethAmount = await act.getEtherBalance(store.account.accountAddress)
    if (ethAmount < gasEstimate) { throw new Error('Not enough eth') }

    dispatchLoad = {
      did,
      gasEstimate,
      mnemonic,
      name,
      paths,
      price: price || 0,
      size,
      gasPrice,
      step
    }

    dispatch({
      type: events.FEED_MODAL,
      load: { modalName: 'publishNow', ...dispatchLoad }
    })

    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.openModal('publishConfirmModal')
  } catch (err) {
    debug('Error for %s: %o', 'newestimate', err)
    internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, false)
    windowManager.closeModal('generalPleaseWaitModal')
    errorHandling(err)
  }
})

ipcMain.on(events.CONFIRM_PUBLISH, async (_, {
  did,
  mnemonic,
  name,
  price,
  size,
  gasPrice,
  step
}) => {
  debug('%s heard', events.CONFIRM_PUBLISH)
  const {
    accountAddress,
    autoQueue,
    password,
    userDID
  } = store.account
  try {
    windowManager.closeWindow('manageFileView')
    internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, true)

    const descriptor = await descriptorGeneration.makeDescriptor(did, {
      did,
      datePublished: new Date,
      name,
      owner: true,
      size,
      status: events.PUBLISHING,
      price: Number(price),
    })

    dispatch({ type: events.PUBLISHING, load: descriptor })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

    this.onhash = (_, hash) => {
      debug('%s tx hash: %s', _, hash)
      const load = { step: _, [`${_}Hash`]: hash }
      dispatch({ type: events.PUBLISH_PROGRESS, load })
      windowManager.openModal('publishProgressModal')
      windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH, load })
    }

    this.onreceipt = (_, receipt) => {
      debug('%s tx receipt:', _, receipt)
      step = undefined
      errored = false
    }

    this.onerror = (_, error) => {
      debug('%s tx error:', _, error)
      errored = true
      dispatch({ type: events.FEED_MODAL,
        load: {
          modalName: 'transactionError',
          callback: () => {
            internalEmitter.emit(events.PUBLISH_NEW_GAS, true, { step: _ })
          }
        }
      })
      windowManager.closeModal('publishProgressModal')
      windowManager.openModal('generalActionModal')
    }

    this.startTimer = (_) => {
      setTimeout(
        () => {
          let trigger = false
          switch (_) {
            case 'retrydeploy':
              trigger = !(deployed || errored)
              break
            case 'retrywrite':
              trigger = !(written || errored)
              break
            case 'retryprice':
              trigger = !(priced || errored)
              break
          }
          debug('timeout', trigger)
          if (trigger) {
            dispatch({ type: events.PUBLISH_PROGRESS, load: { step: _ } })
            windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH })
          }
        }, GAS_TIMEOUT
      )
    }

    if ('publish' === step || 'deploy' === step) {
      if ('deploy' === step) autoQueue.clear()
      this.startTimer('retrydeploy')
      await new Promise((resolve, reject) => {
        autoQueue.push(
          analytics.trackPublishStart,
          () => araFilesystem.deploy({
            password,
            did,
            gasPrice,
            onhash: hash => this.onhash('deploy', hash),
            onreceipt: (receipt) => {
              this.onreceipt('deploy', receipt)
              deployed = true
              resolve()
            },
            onerror: (error) => {
              if (!deployed) {
                this.onerror('deploy', error)
                reject()
              }
            }
          })
        )
      })
      if (errored && !deployed) {
        return
      }
    }

    if (deployed || 'write' === step) {
      if ('write' === step) autoQueue.clear()
      this.startTimer('retrywrite')
      await new Promise((resolve, reject) => {
        autoQueue.push(
          () => araFilesystem.commit({
            did,
            password,
            price: Number(price),
            gasPrice,
            writeCallbacks: {
              onhash: hash => this.onhash('write', hash),
              onreceipt: (receipt) => {
                this.onreceipt('write', receipt)
                written = true
                this.startTimer('retryprice')
              },
              onerror: (error) => {
                if (!written) {
                  this.onerror('write', error)
                  reject()
                }
              },
            },
            priceCallbacks: {
              onhash: hash => this.onhash('price', hash),
              onreceipt: (receipt) => {
                this.onreceipt('price', receipt)
                priced = true
                windowManager.closeModal('publishProgressModal')
                resolve()
              },
              onerror: error => {
                if (!priced) {
                  this.onerror('price', error)
                  reject()
                }
              }
            }
          }),
          analytics.trackPublishFinish
        )
      })
      if (errored && !(written && priced)) {
        return
      }
    }

    if ('price' === step) {
      autoQueue.clear()
      this.startTimer('retryprice')
      await new Promise((resolve, reject) => {
        autoQueue.push(
          () => araFilesystem.setPrice({
            did,
            password,
            price: Number(price),
            gasPrice,
            onhash: hash => this.onhash('price', hash),
            onreceipt: (receipt) => {
              this.onreceipt('price', receipt)
              priced = true
              windowManager.closeModal('publishProgressModal')
              resolve()
            },
            onerror: error => {
              if (!priced) {
                this.onerror('price', error)
                reject()
              }
            }
          })
        )
      })
      if (errored && !priced) {
        return
      }
    }

    if (deployed && written && priced) {
      internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, false)

      const balance = await act.getAraBalance(userDID)
      dispatch({
        type: events.PUBLISHED,
        load: { balance, did, name, mnemonic }
      })

      windowManager.pingView({ view: 'filemanager', event: events.REFRESH, load: {
        type: events.PUBLISHED,
        load: { balance, did, name, mnemonic }
      } })
      windowManager.openModal('mnemonicWarning')

      const publishedSub = await act.subscribePublished({ did })
      const rewardsSub = await act.subscribeRewardsAllocated(did, accountAddress, userDID)
      dispatch({ type: events.ADD_PUBLISHED_SUB, load: { publishedSub, rewardsSub } })

      internalEmitter.emit(events.START_SEEDING, { did })
    }
  } catch (err) {
    debug('Err in %s: %o', 'newConfirmPublish', err)
  }
})

function errorHandling(err) {
  internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, false)
  err.message === 'Not enough eth'
    ? dispatch({ type: events.FEED_MODAL, load: { modalName: 'notEnoughEth' } })
    : dispatch({ type: events.FEED_MODAL, load: { modalName: 'failureModal2' } })
  windowManager.openModal('generalMessageModal')
}

async function _feedManageFile() {
  debug('%s heard', events.OPEN_MANAGE_FILE_VIEW)
  try {
    dispatch({
      type: events.OPEN_MANAGE_FILE_VIEW,
      load: {
        did: null,
        price: '',
        name: '',
        fileList: [],
        uncommitted: true
      }
    })
    windowManager.openWindow('manageFileView')
  } catch (err) {
    debug('Error for %s: %o', 'newevent', err)
  }
}
