const windowManager = require('electron-window-manager')
const { events: k } = require('k')

function refresh(view) {
  windowManager.pingView({ view, event: k.REFRESH })
}

module.exports = { refresh }
