'use strict'

const k = require('../../../lib/constants/stateManagement')

module.exports = (state, { load = null, type }) => {
  let file
  switch (type){
    case k.CHANGE_BROADCASTING_STATE:
      file = findFile(load.did, state.published.concat(state.purchased))
      if (file == null) { break }
      file.shouldBroadcast = load.shouldBroadcast
      break
    case k.DOWNLOADING:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.downloadPercent = load.downloadPercent || 0
      file.status = k.DOWNLOADING
      break
    case k.DOWNLOADED:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
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
      state.published = state.published.slice(0, state.published.length - 1)
      break
    case k.LOADED_BACKGROUND_AFS_DATA:
      state.published = load.published
      state.purchased = load.purchased
      break
    case k.GOT_LIBRARY:
      state.loadingLibrary = false
      state.published = load.published
      state.purchased = load.purchased
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
    case k.PUBLISHING:
      state.published.push(load)
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
      if (file == null) { break }
      file.jobId = load.jobId
      file.status = k.AWAITING_DOWNLOAD
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
      if (file == null) { break }
      file.earnings += Number(load.earning)
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
    case k.SET_SIZE:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.size = file.size || load.size
      break
    case k.SUBMITTING_JOB:
      file = findFile(load.did, state.purchased)
      if (file == null) { break }
      file.downloadPercent = 0
      file.status = k.SUBMITTING_JOB
      break
    default:
      return state
  }
  return state
}

function findFile(did, files) {
	return files.find(file => file.did === did)
}