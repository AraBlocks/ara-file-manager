const { internalEmitter } = require('electron-window-manager')
const { dcdn: farmerManager } = require('../kernel/daemons')
const { farmer: { farm } } = require('../kernel/store')
const { events: k } = require('k')

module.exports = () => {
  internalEmitter.emit(k.CANCEL_SUBSCRIPTION)
  farmerManager.stopAllBroadcast(farm)
}
