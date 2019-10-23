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

ipcMain.on(events.OPEN_MANAGE_FILE_VIEW, _feedManageFile)
internalEmitter.on(events.OPEN_MANAGE_FILE_VIEW, (load) => _feedManageFile(null, load))

ipcMain.on(events.PUBLISH, async (_, { name, paths, price }) => {
  debug('%s heard', events.PUBLISH)
  const { password, userDID } = store.account
  try {
    dispatch({ type: events.FEED_MODAL, load: { modalName: 'suggestingGasPrices' } })
    windowManager.openModal('generalPleaseWaitModal')
    let { afs, afs: { did }, mnemonic } = await araFilesystem.create({ owner: userDID, password })
    await (await araFilesystem.add({ did, paths, password })).close()
    await afs.close()

    const size = paths.reduce((sum, file) => sum += fs.statSync(file).size, 0)
    await daemonsUtil.writeFileMetaData({ did, size, title: name, password })

    const gasPrice = await daemonsUtil.requestGasPrice()
    const { average, fast, fastest } = gasPrice
    dispatch({ type: events.SET_GAS_PRICE, load: { average: Number(average)/10, fast: Number(fast)/10, fastest: Number(fastest)/10, name, paths, price, did, mnemonic, size } })
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

internalEmitter.on(events.NEW_GAS, async (_, { step }) => {
  debug('%s heard', events.NEW_GAS)
  const gasPrice = await daemonsUtil.requestGasPrice()
  const { average, fast, fastest } = gasPrice
  dispatch({ type: events.SET_GAS_PRICE, load: { average: Number(average)/10, fast: Number(fast)/10, fastest: Number(fastest)/10, step } })
  windowManager.openModal('setGasModal')
})

ipcMain.on(events.NEW_GAS, async (_, { step }) => {
  debug('%s heard', events.NEW_GAS)
  const gasPrice = await daemonsUtil.requestGasPrice()
  const { average, fast, fastest } = gasPrice
  dispatch({ type: events.SET_GAS_PRICE, load: { average: Number(average)/10, fast: Number(fast)/10, fastest: Number(fastest)/10, step } })
  windowManager.openModal('setGasModal')
})

ipcMain.on(events.GAS_PRICE, async(_, { gasPrice, step }) => {
  debug('%s heard', events.GAS_PRICE)

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

    let errored = false
    if (!step || 'deploy' === step) {
      if ('deploy' === step) autoQueue.clear()
      let published = false
      setTimeout(
        () => {
          if (!published && !errored) {
            dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'retrydeploy' } })
            windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH })
          }
        }, 25000
      )
      await autoQueue.push(
        analytics.trackPublishStart,
        () => araFilesystem.deploy({
          password,
          did,
          gasPrice,
          onhash: hash => {
            console.log('deploy onhash', hash)
            step = undefined
            dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'deploy', deployHash: hash } })
            windowManager.openModal('publishProgressModal')
          },
          onreceipt: receipt => {
            console.log('deploy onreceipt')
            published = true
            errored = false
          },
          onconfirmation: (confNumber, receipt) => {
            console.log('deploy onconfirmation')
          },
          onerror: error => {
            console.log('deploy onerror', error)
            errored = true
            dispatch({ type: events.FEED_MODAL,
              load: {
                modalName: 'transactionError',
                callback: () => {
                  internalEmitter.emit(events.NEW_GAS, true, { step: 'deploy' })
                }
              }
            })
            windowManager.closeModal('publishProgressModal')
            windowManager.openModal('generalActionModal')
          },
          onmined: receipt => {
            console.log('deploy onmined')
          }
        })
      )
      if (errored && !published) {
        return
      }
    }

    let priced = false
    if (!step || 'write' === step) {
      if ('write' === step) autoQueue.clear()
      let written = false
      setTimeout(
        () => {
          if (!written && !errored) {
            dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'retrywrite' } })
            windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH })
          }
        }, 25000
      )
      await autoQueue.push(
        () => araFilesystem.commit({
          did,
          password,
          price: Number(price),
          gasPrice,
          writeCallbacks: {
            onhash: hash => {
              console.log('write onhash', hash)
              step = undefined
              dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'write', writeHash: hash } })
              if (step) {
                windowManager.openModal('publishProgressModal')
              } else {
                windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH, load: { step: 'write', writeHash: hash } })
              }
            },
            onreceipt: receipt => {
              console.log('write onreceipt')
              written = true
              errored = false
              setTimeout(
                () => {
                  if (!priced) {
                    dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'retryprice' } })
                    windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH })
                  }
                }, 25000
              )
            },
            onconfirmation: (confNumber, receipt) => {
              console.log('write onconfirmation')
            },
            onerror: error => {
              console.log('write onerror', error)
              errored = true
            },
            onmined: receipt => {
              console.log('write onmined')
            }
          },
          priceCallbacks: {
            onhash: hash => {
              console.log('price onhash', hash)
              step = undefined
              dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'price', priceHash: hash } })
              if (step) {
                windowManager.openModal('publishProgressModal')
              } else {
                windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH, load: { step: 'price', priceHash: hash } })
              }
            },
            onreceipt: receipt => {
              console.log('price onreceipt')
              priced = true
              errored = false
            },
            onconfirmation: (confNumber, receipt) => {
              console.log('price onconfirmation')
            },
            onerror: error => {
              errored = true
              console.log('price onerror', error)
            },
            onmined: receipt => {
              console.log('price onmined')
              windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH, load: { step: 'priceMined', receipt } })
              windowManager.closeModal('publishProgressModal')
            }
          }
        }),
        analytics.trackPublishFinish
      )
      if (errored && !(written && priced)) {
        return
      }
    }

    if ('price' === step) {
      autoQueue.clear()
      setTimeout(
        () => {
          if (!priced && !errored) {
            dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'retryprice' } })
            windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH })
          }
        }, 120000
      )
      await autoQueue.push(
        () => araFilesystem.setPrice({
          did,
          password,
          price: Number(price),
          gasPrice,
          onhash: hash => {
            console.log('price onhash', hash)
            step = undefined
            dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'price', priceHash: hash } })
            if (step) {
              windowManager.openModal('publishProgressModal')
            } else {
              windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH, load: { step: 'price', priceHash: hash } })
            }
          },
          onreceipt: receipt => {
            console.log('price onreceipt')
            priced = true
          },
          onconfirmation: (confNumber, receipt) => {
            console.log('price onconfirmation')
          },
          onerror: error => {
            console.log('price onerror', error)
            errored = true
          },
          onmined: receipt => {
            console.log('price onmined')
            windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH, load: { step: 'priceMined', receipt } })
            windowManager.closeModal('publishProgressModal')
          }
        })
      )
      if (errored && !priced) {
        return
      }
    }

    internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, false)

    const balance = await act.getAraBalance(userDID)
    dispatch({
      type: events.PUBLISHED,
      load: { balance, did, name, mnemonic }
    })

    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
    windowManager.openModal('mnemonicWarning')

    const publishedSub = await act.subscribePublished({ did })
    const rewardsSub = await act.subscribeRewardsAllocated(did, accountAddress, userDID)
    dispatch({ type: events.ADD_PUBLISHED_SUB, load: { publishedSub, rewardsSub } })

    internalEmitter.emit(events.START_SEEDING, { did })
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
