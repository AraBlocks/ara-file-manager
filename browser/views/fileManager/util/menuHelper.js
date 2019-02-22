const { events: k } = require('k')
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
    case k.DOWNLOADED_PUBLISHED:
      if (opts.packageOpened) { break }
      opts.shouldBroadcast
        ? menuItems.addItem('Stop Seeding', k.STOP_SEEDING)
        : menuItems.addItem('Seed', k.START_SEEDING)
      menuItems.addItem('Open Package', k.OPEN_AFS)
      if (opts.owner) { menuItems.addItem('Manage Package', k.FEED_MANAGE_FILE) }
      break
    case k.AWAITING_DOWNLOAD:
      menuItems.addItem('Download Package', k.DOWNLOAD)
      break
    case k.UPDATE_AVAILABLE:
      menuItems.addItem('Open Package', k.OPEN_AFS)
      menuItems.addItem('Update Package', k.DOWNLOAD)
      break
    case k.PAUSED:
      menuItems.addItem('Continue Download', k.DOWNLOAD)
      break
    case k.DOWNLOADING:
      menuItems.addItem('Pause Download', k.PAUSE_DOWNLOAD)
      break
    case k.OUT_OF_SYNC:
      //TODO: this event is not correct
      menuItems.addItem('Sync Package', k.UPDATE_FILE)
      break
    case k.UNCOMMITTED:
      //Listener for DEPLOY_PROXY will check for unpublished AFS, find it, and open publishView. No proxy will be deployed
      menuItems.pop()
      menuItems.addItem('Publish Package', k.DEPLOY_PROXY)
      break
    case k.CONNECTING:
      menuItems.addItem('Stop Connecting', k.STOP_SEEDING)
      break
  }

  if (opts.allocatedRewards && opts.redeeming === false) {
    menuItems.addItem('Redeem Rewards', k.REDEEM_REWARDS)
  }
  return { items: menuItems }
}