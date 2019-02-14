const { events: k } = require('k')

module.exports = (state, { load = null, type }) => {
  let file
  switch (type) {
    case k.CHANGE_BROADCASTING_STATE:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.shouldBroadcast = load.shouldBroadcast
      file.status = file.status === k.CONNECTING ? k.AWAITING_DOWNLOAD : file.status
      break
    case k.CLOSE_AFS_EXPLORER:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.packageOpened = false
      break
    case k.DOWNLOADING:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.downloadPercent = load.downloadPercent || 0
      file.status = k.DOWNLOADING
      file.size = file.size || load.size
      break
    case k.DOWNLOADED:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.name = load.name
      file.downloadPercent = 1
      file.status = k.DOWNLOADED_PUBLISHED
      file.shouldBroadcast = true
      break
    case k.DOWNLOAD_FAILED:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.downloadPercent = 0
      file.status = k.DOWNLOAD_FAILED
      break
    case k.ERROR_PUBLISHING:
      file = state.published[state.published.length - 1]
      file.status = load.oldStatus
      file.size = 0
      break
    case k.ERROR_PURCHASING:
      state.purchased = state.purchased.slice(0, state.purchased.length - 1)
      break
    case k.FEED_CONTENT_VIEWER:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.packageOpened = true
      break
    case k.LOADED_BACKGROUND_AFS_DATA:
      state.published = load.published
      state.purchased = load.purchased
      break
    case k.GOT_COMMIT_STATUS:
      file = findFile(load.did, state.published)
      file.status = load.status === k.UNCOMMITTED ? k.UNCOMMITTED : file.status
      break
    case k.GOT_DL_PERC_AND_STATUS:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.status = load.status
      file.downloadPercent = load.downloadPercent
      break
    case k.GOT_LIBRARY:
      state.loadingLibrary = false
      state.published = load.published
      state.purchased = load.purchased
      break
    case k.GOT_EARNING:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.earnings += Number(load.earnings)
      break
    case k.GOT_META:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.name = load.meta.title || null
      file.size = load.meta.size || 0
      file.datePublished = load.meta.timestamp || null
      break
    case k.GOT_PRICE:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.price = load.price
      break
    case k.GOT_REWARDS:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.allocatedRewards = load.allocatedRewards
      break
    case k.GETTING_USER_DATA:
      state.loadingLibrary = true
      break
    case k.LOGOUT:
    case k.CLEAN_UI:
      state.published = []
      state.purchased = []
      state.loadingLibrary = false
      break
    case k.PAUSED:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.status = k.PAUSED
      break
    case k.PUBLISHING:
      file = findFile(load.did, state.published)
      Object.assign(file, load)
      break
    case k.PUBLISHED:
      file = findFile(load.did, state.published)
      if (file == null) { break }
      file.status = k.DOWNLOADED_PUBLISHED,
      file.datePublished = new Date
      file.shouldBroadcast = true
      file.owner = true
      break
    case k.PURCHASING:
      state.purchased.push(load)
      break
    case k.PURCHASED:
      file = findFile(load.did, state.purchased)
      file.jobId = load.jobId
      file.status = k.AWAITING_DOWNLOAD
      break
    case k.PROXY_DEPLOYED:
      state.published.push(load.descriptor)
      break
    case k.UPDATE_AVAILABLE:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.status = k.UPDATE_AVAILABLE
      break
    case k.UPDATING_FILE:
      file = findFile(load.did, state.published)
      if (file == null) { break }
      file.name = load.name
      file.price = load.price == null ? file.price : load.price
      file.size = load.size == 0 ? file.size : load.size
      file.status = k.UPDATING_FILE
      break
    case k.UPDATED_FILE:
      file = findFile(load.did, state.published)
      if (file == null) { break }
      file.status = k.DOWNLOADED_PUBLISHED
      break
    case k.UPDATE_EARNING:
      file = findFile(load.did, state.published)
      file.earnings += Number(load.earning)
      break
    case k.UPDATE_META:
      file = findFile(load.did, state.published)
      Object.assign(file, load)
      break
    case k.UPDATE_PEER_COUNT:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.peers = load.peers
      break
    case k.REDEEMING_REWARDS:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.redeeming = true
      break
    case k.REWARDS_ALLOCATED:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.allocatedRewards = load.rewardsBalance
      break
    case k.REWARDS_REDEEMED:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.allocatedRewards = 0
      file.earnings += Number(load.value)
      file.redeeming = false
      break
    case k.CONNECTING:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.downloadPercent = 0
      file.status = k.CONNECTING
      break
    default:
      return state
  }
  return state
}

function findFile(did, files) {
  return files.find(file => file.did === did)
}
