'use strict'

const debug = require('debug')('afm:kernel:lib:actionCreators:login')
const araUtil = require('ara-util')
const aid = require('ara-identity')
const {
  afmManager,
  acmManager,
  farmerManager,
  identityManager,
  descriptorGeneration
} = require('../../actions')
const dispatch = require('../../reducers/dispatch')
const helpers = require('./helpers')
const { stateManagement: k } = require('k')
const { internalEmitter } = require('electron-window-manager')
const { switchLoginState } = require('../../../../boot/tray')
const { switchApplicationMenuLoginState } = require('../../../../boot/menu')
const { pause } = require('../../../lib')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

internalEmitter.on(k.LOGOUT, () => {
  dispatch({ type: k.FEED_MODAL, load: { modalName: 'logoutConfirm', callback: logout } })
  windowManager.openModal('generalActionModal')
})

internalEmitter.on(k.GET_CACHED_DID, async () => {
  const did = await afmManager.getCachedUserDid()
  dispatch({ type: k.GOT_CACHED_DID, load: { did } })
  windowManager.pingView({ view: 'login', event: k.REFRESH })
})

ipcMain.on(k.LOGIN, login)

ipcMain.on(k.RECOVER, async (event, load) => {
  debug('%s heard', k.RECOVER)
  try {
    windowManager.pingView({ view: 'recover', event: k.RECOVERING })

    const identity = await identityManager.recover(load)
    await identityManager.archive(identity)

    const { did } = identity.did
    login(null, { userDID: did, password: load.password })

    windowManager.pingView({ view: 'recover', event: k.RECOVERED })
  } catch (err) {
    const dispatchLoad = {
      modalName: 'recoveryFailure',
      callback: () => windowManager.pingView({ view: 'recover', event: k.RECOVER_FAILED })
    }
    dispatch({ type: k.FEED_MODAL, load: dispatchLoad })
    windowManager.openModal('generalMessageModal')
  }
})

async function logout() {
  try {
    await farmerManager.stopAllBroadcast(store.farmer.farm)
    dispatch({ type: k.LOGOUT })
    internalEmitter.emit(k.DUMP_DEEPLINK_DATA)
    internalEmitter.emit(k.CANCEL_SUBSCRIPTION)
    internalEmitter.emit(k.GET_CACHED_DID)
    switchLoginState(false)
    switchApplicationMenuLoginState(false)
    //TODO: make closeAll function
    windowManager.closeAll()
    windowManager.openWindow('login')
  } catch (err) {
    debug('Error logging out: %o', o)
  }
}

async function login(_, load) {
  debug('%s heard', k.LOGIN)
  try {
    const ddo = await aid.resolve(load.userDID)
    const incorrectPW = !(await araUtil.isCorrectPassword({ ddo, password: load.password }))
    if (incorrectPW) { throw 'IncorrectPW' }
  } catch (err) {
    debug('Login error: %o', err)
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'loginFail', callback: () => windowManager.openWindow('login') } })
    windowManager.openModal('generalMessageModal')
    return
  }

  const userDID = araUtil.getIdentifier(load.userDID)
  //writes did signed in with to disk to autofill input next time app booted
  afmManager.cacheUserDid(userDID)

  try {
    const { accountAddress, farmer } = await helpers.getInitialAccountState(userDID, load.password)

    switchLoginState(true)
    switchApplicationMenuLoginState(true)

    const DCDNStore = farmerManager.loadDCDNStore(farmer)
    const purchasedDIDs = await acmManager.getLibraryItems(userDID)
    //Returns objects representing various info around DIDs
    let purchased = purchasedDIDs.map(did => descriptorGeneration.makeDummyDescriptor(did, DCDNStore))
    const publishedDIDs = (await acmManager.getDeployedProxies(accountAddress)).map(araUtil.getIdentifier)
    let published = publishedDIDs.map(did => descriptorGeneration.makeDummyDescriptor(did, DCDNStore, true))

    const { files } = dispatch({ type: k.GOT_LIBRARY, load: { published, purchased } })

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    //Need to throttle to allow UI to updated. Main thread gets flooded and laggy if you dont
    await pause(250)

    const credentials = { userDID, accountAddress, password: load.password }
    await helpers.populateUI(files.published, files.purchased, credentials)
    await helpers.getSubscriptions(files.purchased, files.purchased.concat(files.published), credentials)

    if (store.files.deepLinkData !== null) {
      internalEmitter.emit(k.PROMPT_PURCHASE, store.files.deepLinkData)
    }

    farmer.start()

    debug('Login complete')
  } catch (err) {
    debug('Error: %O', err)
  }
}