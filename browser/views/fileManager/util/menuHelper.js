const { events } = require('k')
const { deeplink, windowManagement } = require('../../../lib/tools')

module.exports = (opts, closeContextMenuCB = () => {}) => {
  const menuItems = [
    {
      children: 'Copy Link',
      onclick: (e) => {
        deeplink.copyDeeplink(opts.did, opts.name)
        e.stopPropagation()
      },
      onclickText: 'Copied!'
    }
  ]
  menuItems.addItem = function (children, event) {
    this.push({
      children, onclick: (e) => {
        e.stopPropagation()
        closeContextMenuCB()
        windowManagement.emit({ event, load: { did: opts.did, name: opts.name } })
      }
    })
  }
  switch (opts.status) {
    case events.DOWNLOADED_PUBLISHED:
      if (opts.packageOpened) { break }
      opts.shouldBroadcast
        ? menuItems.addItem('Stop Seeding', events.STOP_SEEDING)
        : menuItems.addItem('Seed', events.START_SEEDING)
      menuItems.addItem('Open Package', events.OPEN_AFS)
      if (opts.owner) { menuItems.addItem('Manage Package', events.LOAD_MANAGE_FILE_UPDATE) }
      break
    case events.AWAITING_DOWNLOAD:
      menuItems.addItem('Download Package', events.DOWNLOAD)
      break
    case events.UPDATE_AVAILABLE:
      menuItems.addItem('Open Package', events.OPEN_AFS)
      menuItems.addItem('Update Package', events.DOWNLOAD)
      break
    case events.PAUSED:
      menuItems.addItem('Continue Download', events.DOWNLOAD)
      break
    case events.DOWNLOADING:
      menuItems.addItem('Pause Download', events.PAUSE_DOWNLOAD)
      break
    case events.OUT_OF_SYNC:
      //TODO: this event is not correct
      menuItems.addItem('Sync Package', events.UPDATE_FILE)
      break
    case events.CONNECTING:
      menuItems.addItem('Stop Connecting', events.STOP_SEEDING)
      break
  }

  if (opts.allocatedRewards && opts.redeeming === false) {
    menuItems.addItem('Redeem Rewards', events.REDEEM_REWARDS)
  }
  return { items: menuItems }
}