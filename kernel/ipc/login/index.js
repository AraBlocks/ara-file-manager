const debug = require('debug')('ara:fm:kernel:ipc:login')

const araUtil = require('ara-util')
const araIdentity = require('ara-identity')
const { events } = require('k')
const { internalEmitter } = require('electron-window-manager')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

const {
  afm,
  act,
  aid,
  descriptorGeneration,
  rewardsDCDN
} = require('../../daemons')
const dispatch = require('../../redux/reducers/dispatch')
const helpers = require('./login.helpers')
const menuHelper = require('../../../boot/menuHelper')
const { pause } = require('../../lib')

const store = windowManager.sharedData.fetch('store')

internalEmitter.on(events.LOGOUT, () => {
  debug('%s HEARD', events.LOGOUT)
  //Callback must use internal emitter. We will never know why
  const callback = () => internalEmitter.emit(events.CONFIRM_LOGOUT)
  dispatch({ type: events.FEED_MODAL, load: { modalName: 'logoutConfirm', callback } })
  windowManager.openModal('generalActionModal')
})

ipcMain.on(events.LOGOUT, () => {
  debug('%s HEARD', events.LOGOUT)
  //Callback must use internal emitter. We will never know why
  const callback = () => internalEmitter.emit(events.CONFIRM_LOGOUT)
  dispatch({ type: events.FEED_MODAL, load: { modalName: 'logoutConfirm', callback } })
  windowManager.openModal('generalActionModal')
})

internalEmitter.on(events.GET_CACHED_DID, async () => {
  const did = await afm.getCachedUserDid()
  dispatch({ type: events.GOT_CACHED_DID, load: { did } })
  windowManager.pingView({ view: 'login', event: events.REFRESH })
})

internalEmitter.on(events.CONFIRM_LOGOUT, async () => {
  debug('%s heard', events.CONFIRM_LOGOUT)
  try {
    await rewardsDCDN.stopAllBroadcast(store.farmer.farm)
    dispatch({ type: events.LOGOUT })
    internalEmitter.emit(events.CANCEL_SUBSCRIPTION)

    menuHelper.switchLoginState(events.LOGOUT)

    windowManager.closeAll()
    windowManager.openWindow('login')
  } catch (err) {
    debug('Error logging out: %o', o)
  }
})

ipcMain.on(events.LOGIN, login)

ipcMain.on(events.RECOVER, async (_, load) => {
  debug('%s heard', events.RECOVER)
  try {
    windowManager.pingView({ view: 'recover', event: events.RECOVERING })

    const identity = await aid.recover(load)
    await aid.archive(identity)

    const { did } = identity.did
    const userDID = araUtil.getIdentifier(did)
    dispatch({ type: events.RECOVERED, load: { userDID, password: load.password } })
    login(null, { userDID, password: load.password })

    windowManager.pingView({ view: 'recover', event: events.RECOVERED })
  } catch (err) {
    windowManager.pingView({ view: 'recover', event: events.RECOVER_FAILED })
    dispatch({
      type: events.FEED_MODAL, load: {
        modalName: 'recoveryFailure',
      }
    })
    windowManager.openModal('generalMessageModal')
  }
})

async function login(_, load) {
  debug('%s heard', events.LOGIN)
  try {
    const ddo = await araIdentity.resolve(load.userDID)
    const incorrectPW = !(await araUtil.isCorrectPassword({ ddo, password: load.password }))
    if (incorrectPW) { throw 'IncorrectPW' }
  } catch (err) {
    debug('Login error: %o', err)
    dispatch({ type: events.FEED_MODAL, load: { modalName: 'loginFail', callback: () => windowManager.openWindow('login') } })
    windowManager.openModal('generalMessageModal')
    return
  }
  const userDID = araUtil.getIdentifier(load.userDID)
  //writes did signed in with to disk to autofill input next time app booted
  afm.cacheUserDid(userDID)

  try {
    const { accountAddress, farmer } = await helpers.getInitialAccountState(userDID, load.password)
    const DCDNStore = rewardsDCDN.loadDCDNStore(farmer)
    const purchasedDIDs = await act.getLibraryItems(userDID)
    //Returns objects representing various info around DIDs
    let purchased = purchasedDIDs.map(did => descriptorGeneration.makeDummyDescriptor(did, DCDNStore))
    const publishedDIDs = (await act.getDeployedProxies(accountAddress)).map(araUtil.getIdentifier)
    let published = publishedDIDs.map(did => descriptorGeneration.makeDummyDescriptor(did, DCDNStore, true))

    const { files } = dispatch({ type: events.GOT_LIBRARY, load: { published, purchased } })

    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

    //Need to throttle to allow UI to updated. Main thread gets flooded and laggy if you dont
    await pause(250)

    const credentials = { userDID, accountAddress, password: load.password }
    await helpers.populateUI(files.published, files.purchased, credentials)
    helpers.getSubscriptions(files.purchased, files.purchased.concat(files.published), credentials)

    if (store.application.deepLinkData !== null) {
      internalEmitter.emit(events.PROMPT_PURCHASE, store.application.deepLinkData)
    }

    await farmer.start()

    menuHelper.switchLoginState(events.LOGIN)

    debug('Login complete')
  } catch (err) {
    debug('Error: %O', err)
  }
}
