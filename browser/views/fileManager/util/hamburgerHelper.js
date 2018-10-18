'use strict'

const k = require('../../../../lib/constants/stateManagement')
const Hamburger = require('../../../components/hamburgerMenu')

module.exports = ({ did, shouldBroadcast, status, owner }) => {
  const menuItems = [{ children: `Copy Link` }]

  switch (status) {
    case k.DOWNLOADED_PUBLISHED:
      shouldBroadcast
        ? menuItems.push({ children: 'Stop Seeding AFS'})
        : menuItems.push({ children: 'Seed AFS'})
      if (owner) { menuItems.push({ children: 'Manage File'}) }
      break
    case k.AWAITING_DOWNLOAD:
      menuItems.push({ children: 'Download AFS' })
      break
    case k.UPDATE_AVAILABLE:
      menuItems.push({ children: 'Update AFS' })
      break
    case k.PAUSED:
      menuItems.push({ children: 'Continue Download' })
      break
    case k.DOWNLOADING:
      menuItems.push({ children: 'Pause Download' })
      break
    case k.OUT_OF_SYNC:
      menuItems.push({ children: 'Sync AFS' })
  }

  return new Hamburger(menuItems)
}