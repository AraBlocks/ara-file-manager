const debug = require('debug')('afm:kernel:lib:actionCreators:purchase')

const araUtil = require('ara-util')
const { internalEmitter } = require('electron-window-manager')
const { ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const { stateManagement: k } = require('k')
const windowManager = require('electron-window-manager')

const { acmManager, descriptorGeneration } = require('../actions')
const dispatch = require('../reducers/dispatch')
const {
	account,
	farmer,
	files
} = windowManager.sharedData.fetch('store')

internalEmitter.on(k.OPEN_DEEPLINK, async (load) => {
  try {
    debug('%s heard', k.OPEN_DEEPLINK)
    dispatch({ type: k.OPEN_DEEPLINK, load })
    if (account.userDID == null) { throw new Error('Not logged in') }
    if (load == null ) { throw new Error('Broken link') }
    internalEmitter.emit(k.PROMPT_PURCHASE, load)
    const descriptorOpts = {
      peers: 1,
      name: load.fileName,
      status: k.PURCHASING,
    }
    const descriptor = await descriptorGeneration.makeDescriptor(load.did, descriptorOpts)
    dispatch({ type: k.PURCHASING, load: descriptor })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    dispatch({ type: k.PURCHASED, load: { did: load.did } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    dispatch({ type: k.FEED_MODAL, load: {
      modalName: 'startDownload',
        callback: () => {
          internalEmitter.emit(k.DOWNLOAD, load)
        }
      }
    })
    windowManager.openModal('generalActionModal')
  } catch (err) {
    errorHandler(err)
    dispatch({ type: k.ERROR_PURCHASING, load: { did: load.did } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  }
})

function errorHandler(err) {
	debug(err)
	let modalName
	let callback = () => {}
	switch(err.message) {
		case 'Not enough eth':
			modalName = 'notEnoughEth'
			break
		case 'Not enough Ara':
			modalName = 'notEnoughAra'
			break
		case 'Not logged in':
			modalName = 'notLoggedIn'
			callback = () => windowManager.openWindow('login')
			break
		case 'Broken link':
			modalName = 'brokenLink'
			break
		default:
			modalName = 'purchaseFailed'
			break
	}
	dispatch({ type: k.FEED_MODAL, load: { modalName, callback } })
	windowManager.openModal('generalMessageModal')
	internalEmitter.emit(k.CHANGE_PENDING_PUBLISH_STATE, false)
}
