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
    windowManager.openModal('generalPleaseWaitModal')

    let { afs, afs: { did }, mnemonic } = await araFilesystem.create({ owner: userDID, password })
    await (await araFilesystem.add({ did, paths, password })).close()
    await afs.close()

    const size = paths.reduce((sum, file) => sum += fs.statSync(file).size, 0)
    await daemonsUtil.writeFileMetaData({ did, size, title: name, password })

    const gasEstimate = Number(await araFilesystem.commit({
      did,
      estimate: true,
      estimateDid: networkKeys.ESTIMATE_PROXY_DID,
      password,
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
      size
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
  size
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

    await autoQueue.push(
      analytics.trackPublishStart,
      () => araFilesystem.deploy({
        password,
        did,
        onhash: hash => {
          console.log('deploy onhash', hash)
          dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'deploy', hash } })
          windowManager.openModal('publishProgressModal')
        },
        onreceipt: receipt => {
          console.log('deploy onreceipt')
        },
        onconfirmation: (confNumber, receipt) => {
          console.log('deploy onconfirmation')
        },
        onerror: error => {
          console.log('deploy onerror', error)
          dispatch({ type: events.PUBLISH_PROGRESS, load: { error } })
        },
        onmined: receipt => {
          console.log('deploy onmined')
          dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'deployMined', receipt } })
          // windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH, load: { step: 'deploy', receipt } })
        }
      })
    )

    await autoQueue.push(
      () => araFilesystem.commit({
        did,
        password,
        price: Number(price),
        writeCallbacks: {
          onhash: hash => {
            console.log('write onhash', hash)
            dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'write', hash } })
            windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH, step: { type: 'write', hash } })
          },
          onreceipt: receipt => {
            console.log('write onreceipt')
          },
          onconfirmation: (confNumber, receipt) => {
            console.log('write onconfirmation')
          },
          onerror: error => {
            console.log('write onerror', error)
          },
          onmined: receipt => {
            console.log('write onmined')
            dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'writeMined', receipt } })
            // windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH, load: { step: 'write', receipt } })
          }
        },
        priceCallbacks: {
          onhash: hash => {
            console.log('price onhash', hash)
            dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'price', hash } })
            windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH, load: { step: 'price', hash } })
          },
          onreceipt: receipt => {
            console.log('price onreceipt')
          },
          onconfirmation: (confNumber, receipt) => {
            console.log('price onconfirmation')
          },
          onerror: error => {
            console.log('price onerror', error)
          },
          onmined: receipt => {
            console.log('price onmined')
            dispatch({ type: events.PUBLISH_PROGRESS, load: { step: 'priceMined', receipt } })
            windowManager.pingView({ view: 'publishProgressModal', event: events.REFRESH, load: { step: 'priceMined', receipt } })
            // windowManager.closeModal({ view: 'publishProgressModal' })
          }
        }
      }),
      analytics.trackPublishFinish
    )

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
