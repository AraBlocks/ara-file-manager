const { events } = require('k')

module.exports = {
  redeem: {
    confirmText: 'Redeem Rewards',
    confirmEvent: events.CONFIRM_REDEEM,
    header: 'Redeem Rewards',
    smallMessageText: 'Before redeeming rewards, you will need to pay a small fee'
  },

  deploy: {
    confirmEvent: events.CONFIRM_DEPLOY_PROXY,
    confirmText: 'Confirm',
    header: 'Start Publishing?',
    smallMessageText: 'In order to start the publishing process the File Manager needs to prepare a contract on the network'
  }
}
