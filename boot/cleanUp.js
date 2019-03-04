const { internalEmitter } = require('electron-window-manager')
const { rewardsDCDN } = require('../kernel/daemons')
const { farmer: { farm } } = require('../kernel/redux/store')
const { events } = require('k')

module.exports = () => {
  internalEmitter.emit(events.CANCEL_SUBSCRIPTION)
  rewardsDCDN.stopAllBroadcast(farm)
}