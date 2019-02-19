const debug = require('debug')('ara:fm:kernel:ipc:register:index')
const { events: k } = require('k')
const { AutoQueue } = require('../../util')
const dispatch = require('../../state/dispatch')
const {
  identityManager,
  afsManager,
  acmManager,
  afmManager,
  farmerManager,
  utils: actionUtils
 } = require('../../daemons')
const helpers = require('./register.helpers')
const menuHelper = require('../../../boot/menuHelper')
const araUtil = require('ara-util')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')

ipcMain.on(k.CREATE_USER_DID, async () => {
  debug('%s heard', k.CREATE_USER_DID)
  try {
    const identityProps = await helpers.createIdentity()
    dispatch({
      type: k.CREATED_USER_DID,
      load: {
        ...identityProps,
        araBalance: 0,
        ethBalance: 0,
      }
    })
    windowManager.pingView({
      view: 'registration',
      event: k.CREATED_USER_DID,
      load: {
        userDID: identityProps.userDID,
        mnemonic: identityProps.mnemonic
      }
    })
    const subscriptions = await helpers.getSubscriptions(identityProps)
    dispatch({ type: k.GOT_REGISTRATION_SUBS, load: subscriptions })
  } catch (err) {
    debug('Error creating identity: %o', err)
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'registrationFailed' } })
    windowManager.openModal('generalMessageModal')
    windowManager.closeWindow('registration')
  }
})

ipcMain.on(k.REGISTER, async (_, { mnemonic, password, userDID }) => {
  debug('%s heard', k.REGISTER)
  try {
    windowManager.pingView({ view: 'registration', event: k.REGISTERING })
    const identity = await identityManager.recover({ mnemonic, password })
    windowManager.pingView({ view: 'registration', event: k.REGISTERED })
    await identityManager.archive(identity)
    const accountProps = await helpers.getAccountsProps({ password, userDID })
    dispatch({
      type: k.REGISTERED,
      load: {
        ...accountProps,
        password,
        userDID
      }
    })
  } catch (err) {
    debug('Error creating identity: %o', err)
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'registrationFailed' } })
    windowManager.openModal('generalMessageModal')
    windowManager.closeWindow('registration')
  }
})
