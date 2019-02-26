const debug = require('debug')('afm:kernel:lib:actionCreators:register')

const { stateManagement: k } = require('k')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

const { identityManager } = require('../../actions')
const dispatch = require('../../reducers/dispatch')
const helpers = require('./register.helpers')

ipcMain.on(k.CREATE_USER_DID, helpers.pushAID)

windowManager.internalEmitter.on(k.CREATE_USER_DID, helpers.pushAID)

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