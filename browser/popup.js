const remote = require('electron').remote;
const windowManager = remote.require('electron-window-manager')

const current = windowManager.sharedData.fetch('current')

const Component = require('./views/' + current)
document.body.appendChild((new Component).render())