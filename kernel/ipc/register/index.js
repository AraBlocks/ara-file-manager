const debug = require('debug')('ara:fm:kernel:ipc:register')

const { events } = require('k')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

const { aid, afm } = require('../../daemons')
const dispatch = require('../../redux/reducers/dispatch')
const helpers = require('./register.helpers')

ipcMain.on(events.CREATE_USER_DID, helpers.pushAID)

windowManager.internalEmitter.on(events.CREATE_USER_DID, helpers.pushAID)

ipcMain.on(events.REGISTER, async (_, { mnemonic, password, userDID }) => {
  debug('%s heard', events.REGISTER)
  try {
    windowManager.pingView({ view: 'registration', event: events.REGISTERING })
    const identity = await aid.recover({ mnemonic, password })
    windowManager.pingView({ view: 'registration', event: events.REGISTERED })
    await aid.archive(identity)
    const accountProps = await helpers.getAccountsProps({ password, userDID })
    await afm.cacheUserDid(userDID)
    const accounts = await afm.getCachedUserDids()
    dispatch({ type: events.GOT_ACCOUNTS, load: { accounts } })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

    dispatch({
      type: events.REGISTERED,
      load: {
        ...accountProps,
        username: accounts[accounts.last],
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
