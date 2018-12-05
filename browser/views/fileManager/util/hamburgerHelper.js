'use strict'

const k = require('../../../../lib/constants/stateManagement')
const Hamburger = require('../../../components/hamburgerMenu')
const { deeplink, windowManagement } = require('../../../lib/tools/')

module.exports = ({
  allocatedRewards,
  did,
  name,
  owner,
  redeeming,
  shouldBroadcast,
  status
}) => {
  const menuItems = [
    { children: 'Copy Link',
      onclick: (e) => {
        deeplink.copyDeeplink(did, name)
        e.stopPropagation()
      },
      onclickText: 'Copied!'
    }
  ]
  menuItems.addItem = function (children, event) {
    this.push({ children, onclick: () => windowManagement.emit({ event, load: { did, name } }) })
  }

    switch (status) {
      case k.DOWNLOADED_PUBLISHED:
        shouldBroadcast
          ? menuItems.addItem('Stop Seeding AFS', k.STOP_SEEDING)
          : menuItems.addItem('Seed AFS', k.START_SEEDING)
          menuItems.addItem('Open AFS', k.OPEN_AFS)
        if (owner) menuItems.addItem('Manage File', k.FEED_MANAGE_FILE)
        break
      case k.AWAITING_DOWNLOAD:
        menuItems.addItem('Download AFS', k.DOWNLOAD)
        break
      case k.UPDATE_AVAILABLE:
        menuItems.addItem('Open AFS', k.OPEN_AFS)
        menuItems.addItem('Update AFS', k.DOWNLOAD)
        break
      case k.PAUSED:
        menuItems.addItem('Continue Download', k.DOWNLOAD)
        break
      case k.DOWNLOADING:
        menuItems.addItem('Pause Download', k.PAUSE_DOWNLOAD)
        break
      case k.OUT_OF_SYNC:
        //TODO: this event is not correct
        menuItems.addItem('Sync AFS', k.UPDATE_FILE)
        break
      case k.UNCOMMITTED:
        menuItems.addItem('Manage File', k.FEED_MANAGE_FILE)
    }

  if (allocatedRewards && redeeming === false) {
    menuItems.addItem('Reedeem Rewards', k.REDEEM_REWARDS)
  }
  return new Hamburger(menuItems)
}