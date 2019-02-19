const debug = require('debug')('ara:fm:kernel:ipc:login:index')
const araUtil = require('ara-util')
const aid = require('ara-identity')
const {
  afmManager,
  acmManager,
  farmerManager,
  identityManager,
} = require('../../daemons')
const {
  fileDescriptor: descriptorGeneration
} = require('../../util')
const dispatch = require('../../state/dispatch')
const helpers = require('./login.helpers')
const { events: k } = require('k')
const { internalEmitter } = require('electron-window-manager')
const menuHelper = require('../../../boot/menuHelper')
const { pause } = require('../../util')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

internalEmitter.on(k.LOGOUT, () => {
  debug('%s HEARD', k.LOGOUT)
  //Callback must use internal emitter. We will never know why
  const callback = () => internalEmitter.emit(k.CONFIRM_LOGOUT)
  dispatch({ type: k.FEED_MODAL, load: { modalName: 'logoutConfirm', callback } })
  windowManager.openModal('generalActionModal')
})

ipcMain.on(k.LOGOUT, () => {
  debug('%s HEARD', k.LOGOUT)
  //Callback must use internal emitter. We will never know why
  const callback = () => internalEmitter.emit(k.CONFIRM_LOGOUT)
  dispatch({ type: k.FEED_MODAL, load: { modalName: 'logoutConfirm', callback } })
  windowManager.openModal('generalActionModal')
})

internalEmitter.on(k.GET_CACHED_DID, async () => {
  const did = await afmManager.getCachedUserDid()
  dispatch({ type: k.GOT_CACHED_DID, load: { did } })
  windowManager.pingView({ view: 'login', event: k.REFRESH })
})

internalEmitter.on(k.CONFIRM_LOGOUT, async () => {
  debug('%s heard', k.CONFIRM_LOGOUT)
  try {
    await farmerManager.stopAllBroadcast(store.farmer.farm)
    dispatch({ type: k.LOGOUT })
    internalEmitter.emit(k.CANCEL_SUBSCRIPTION)

    menuHelper.switchLoginState(k.LOGOUT)

    windowManager.closeAll()
    windowManager.openWindow('login')
  } catch (err) {
    debug('Error logging out: %o', o)
  }
})

ipcMain.on(k.LOGIN, login)

ipcMain.on(k.RECOVER, async (_, load) => {
  debug('%s heard', k.RECOVER)
  try {
    windowManager.pingView({ view: 'recover', event: k.RECOVERING })

    const identity = await identityManager.recover(load)
    await identityManager.archive(identity)

    const { did } = identity.did
    const userDID = araUtil.getIdentifier(did)
    dispatch({ type: k.RECOVERED, load: { userDID, password: load.password }})
    login(null, { userDID, password: load.password })

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
    helpers.getSubscriptions(files.purchased, files.purchased.concat(files.published), credentials)

    if (store.application.deepLinkData !== null) {
      internalEmitter.emit(k.PROMPT_PURCHASE, store.application.deepLinkData)
    }

    farmer.start()

    menuHelper.switchLoginState(k.LOGIN)

    debug('Login complete')
  } catch (err) {
    debug('Error: %O', err)
  }
}
