const { events } = require('k')

module.exports = (state, { load = null, type }) => {
  let file
  switch (type) {
    case events.CHANGE_BROADCASTING_STATE:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.shouldBroadcast = load.shouldBroadcast
      file.status = file.status === events.CONNECTING ? events.AWAITING_DOWNLOAD : file.status
      break
    case events.CLOSE_AFS_EXPLORER:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.packageOpened = false
      break
    case events.DOWNLOADING:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.downloadPercent = load.downloadPercent || 0
      file.status = events.DOWNLOADING
      file.size = load.size || file.size
      console.log('DOWNLOADING', file)
      break
    case events.DOWNLOADED:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.name = load.name
      file.downloadPercent = 1
      file.status = events.DOWNLOADED_PUBLISHED
      file.shouldBroadcast = true
      file.size = load.size || file.size
      console.log('DOWNLOADED', file)
      break
    case events.DOWNLOAD_FAILED:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.downloadPercent = 0
      file.status = events.DOWNLOAD_FAILED
      break
    case events.ERROR_PUBLISHING:
      file = state.published[state.published.length - 1]
      file.status = load.oldStatus
      file.size = 0
      break
    case events.ERROR_PURCHASING:
      state.purchased = state.purchased.slice(0, state.purchased.length - 1)
      break
    case events.FEED_CONTENT_VIEWER:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.packageOpened = true
      break
    case events.LOADED_BACKGROUND_AFS_DATA:
      state.published = load.published
      state.purchased = load.purchased
      break
    case events.GOT_DL_PERC_AND_STATUS:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.status = load.status
      file.downloadPercent = load.downloadPercent
      break
    case events.GOT_LIBRARY:
      state.loadingLibrary = false
      state.published = load.published
      state.purchased = load.purchased
      break
    case events.GOT_EARNING:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.earnings += Number(load.earnings)
      break
    case events.GOT_META:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.name = load.meta.title || null
      file.size = load.meta.size || 0
      file.datePublished = load.meta.timestamp || null
      break
    case events.GOT_PRICE:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.price = load.price
      break
    case events.GOT_REWARDS:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.allocatedRewards = load.allocatedRewards
      break
    case events.GETTING_USER_DATA:
      state.loadingLibrary = true
      break
    case events.LOGOUT:
    case events.CLEAN_UI:
      state.published = []
      state.purchased = []
      state.loadingLibrary = false
      break
    case events.PAUSED:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.status = events.PAUSED
      break
    case events.PUBLISHING:
      file = findFile(load.did, state.published)
      if (!file) state.published.push(load)
      break
    case events.PUBLISHED:
      file = findFile(load.did, state.published)
      if (file == null) { break }
      file.status = events.DOWNLOADED_PUBLISHED,
      file.datePublished = new Date
      file.shouldBroadcast = true
      file.owner = true
      break
    case events.PURCHASING:
      file = findFile(load.did, state.purchased)
      if (!file) state.purchased.push(load)
      break
    case events.PURCHASED:
      file = findFile(load.did, state.purchased)
      file.jobId = load.jobId
      file.status = events.AWAITING_DOWNLOAD
      break
    case events.PROXY_DEPLOYED:
      state.published.push(load.descriptor)
      break
    case events.UPDATE_AVAILABLE:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.status = events.UPDATE_AVAILABLE
      break
    case events.UPDATING_FILE:
      file = findFile(load.did, state.published)
      if (file == null) { break }
      file.name = load.name
      file.price = load.price == null ? file.price : load.price
      file.size = load.size == 0 ? file.size : load.size
      file.status = events.UPDATING_FILE
      break
    case events.UPDATED_FILE:
      file = findFile(load.did, state.published)
      if (file == null) { break }
      file.status = events.DOWNLOADED_PUBLISHED
      break
    case events.UPDATE_EARNING:
      file = findFile(load.did, state.published)
      file.earnings += Number(load.earning)
      break
    case events.UPDATE_META:
      file = findFile(load.did, state.published)
      Object.assign(file, load)
      break
    case events.UPDATE_PEER_COUNT:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.peers = load.peers
      break
    case events.REDEEMING_REWARDS:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.redeeming = true
      break
    case events.REWARDS_ALLOCATED:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.allocatedRewards = load.rewardsBalance
      break
    case events.REWARDS_REDEEMED:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.allocatedRewards = 0
      file.earnings += Number(load.value)
      file.redeeming = false
      break
    case events.CONNECTING:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.downloadPercent = 0
      file.status = events.CONNECTING
      console.log('CONNECTING', file)
      break
    default:
      return state
  }
  return state
}

function findFile(did, files) {
  return files.find(file => file.did === did)
}
