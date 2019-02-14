const { events: k } = require('k')

module.exports = {
  redeem: {
    confirmText: 'Redeem Rewards',
    confirmEvent: k.CONFIRM_REDEEM,
    header: 'Redeed Rewards',
    smallMessageText: 'Before redeeming rewards, you will need to pay a small fee'
  },

  deploy: {
    confirmEvent: k.CONFIRM_DEPLOY_PROXY,
    confirmText: 'Confirm',
    header: 'Start Publishing?',
    smallMessageText: 'In order to start the publishing process the File Manager needs to prepare a contract on the network'
  }
}