'use strict'

const remote = require('electron').remote
const windowManager = remote.require('electron-window-manager')

module.exports = {
    quitApp() {
        windowManager.closeAll()
    },

    closeWindow() {
        close()
    }
}