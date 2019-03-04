const debug = require('debug')('afm:kernel:lib:actionCreators:register')

const { events } = require('k')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

const { identityManager } = require('../../actions')
const dispatch = require('../../reducers/dispatch')
const helpers = require('./register.helpers')

ipcMain.on(events.CREATE_USER_DID, helpers.pushAID)

windowManager.internalEmitter.on(events.CREATE_USER_DID, helpers.pushAID)

ipcMain.on(events.REGISTER, async (_, { mnemonic, password, userDID }) => {
  debug('%s heard', events.REGISTER)
  try {
    windowManager.pingView({ view: 'registration', event: events.REGISTERING })
    const identity = await identityManager.recover({ mnemonic, password })
    windowManager.pingView({ view: 'registration', event: events.REGISTERED })
    await identityManager.archive(identity)
    const accountProps = await helpers.getAccountsProps({ password, userDID })
    dispatch({
      type: events.REGISTERED,
      load: {
        ...accountProps,
        password,
        userDID
      }
    })
  } catch (err) {
    debug('Error creating identity: %o', err)
    dispatch({ type: events.FEED_MODAL, load: { modalName: 'registrationFailed' } })
    windowManager.openModal('generalMessageModal')
    windowManager.closeWindow('registration')
  }
})