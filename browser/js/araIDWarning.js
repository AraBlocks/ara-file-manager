const ARAIDWarning = require('../views/araIDWarning')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const { events } = require('k')

const { account } = store
const araIDWarning = new ARAIDWarning({ ...account })
document.getElementById('container').appendChild(araIDWarning.render())

ipcRenderer.send(events.PAGE_VIEW, { view: 'araIDWarning' })
