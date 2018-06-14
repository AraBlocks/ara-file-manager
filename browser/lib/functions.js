'use strict'

const { kSendDataRequest } = require('../../lib/ipc')
const { ipcRenderer: ipc } = require('electron')

module.exports = {
  getData: () => ipc.send(kSendDataRequest)
}