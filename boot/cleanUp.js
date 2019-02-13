const { internalEmitter } = require('electron-window-manager')
const { farmerManager } = require('../kernel/redux/actions')
const { farmer: { farm } } = require('../kernel/redux/store')
const { stateManagement: k } = require('k')

module.exports = () => {
  internalEmitter.emit(k.CANCEL_SUBSCRIPTION)
  farmerManager.stopAllBroadcast(farm)
}