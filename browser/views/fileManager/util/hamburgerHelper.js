'use strict'

const k = require('../../../../lib/constants/stateManagement')
const Hamburger = require('../../../components/hamburgerMenu')
const { deeplink, windowManagement } = require('../../../lib/tools/')

module.exports = ({
  did,
  name,
  owner,
  shouldBroadcast,
  status
}) => {
  try {
    const menuItems = [{
      children: 'Copy Link',
      onclick: () => deeplink.copyDeeplink(did, name)
    }]
    menuItems.addItem = function (children, event) {
      this.push({ children, onclick: () => windowManagement.emit({ event, load: did }) })
    }

    switch (status) {
      case k.DOWNLOADED_PUBLISHED:
        shouldBroadcast
          ? menuItems.addItem('Stop Seeding AFS', k.STOP_SEEDING)
          : menuItems.addItem('Seed AFS', k.START_SEEDING)
        if (owner) menuItems.addItem('Manage File', k.UPDATE_FILE)
        break
      case k.AWAITING_DOWNLOAD:
        menuItems.addItem('Download AFS', k.DOWNLOAD)
        break
      case k.UPDATE_AVAILABLE:
        menuItems.addItem('Update AFS', k.DOWNLOAD)
        break
      case k.PAUSED:
        menuItems.addItem('Continue Download', k.DOWNLOAD)
        break
      case k.DOWNLOADING:
        menuItems.addItem('Pause Download', k.PAUSE_DOWNLOAD)
        break
      case k.OUT_OF_SYNC:
        menuItems.addItem('Sync AFS', k.UPDATE_FILE)
    }

    return new Hamburger(menuItems)
  } catch (err) {
    debug('Error helping the hamburger:', err)
    return new Hamburger
  }
}