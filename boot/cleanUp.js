const { internalEmitter } = require('electron-window-manager')
const { farmerManager } = require('../kernel/redux/actions')
const { farmer: { farm } } = require('../kernel/redux/store')
const { events } = require('k')

module.exports = () => {
  internalEmitter.emit(events.CANCEL_SUBSCRIPTION)
  farmerManager.stopAllBroadcast(farm)
}