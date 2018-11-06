'use strict'

const k = require('../../../lib/constants/stateManagement')

module.exports = (state, { load = null, type }) => {
  let file
  switch (type){
    case k.CHANGE_BROADCASTING_STATE:
      file = findFile(load.did, state.published.concat(state.purchased))
      file.shouldBroadcast = load.shouldBroadcast
      break
    case k.DOWNLOADING:
      file = state.purchased[state.purchased.length - 1]
      file.downloadPercent = load.downloadPercent || 0
      file.status = k.DOWNLOADING
      break
    case k.DOWNLOADED:
      file = state.purchased[state.purchased.length - 1]
      file.downloadPercent = 1
      file.status = k.DOWNLOADED_PUBLISHED
      break
    case k.DOWNLOAD_FAILED:
      file = state.purchased[state.purchased.length - 1]
      file.downloadPercent = 0
      file.status = k.DOWNLOAD_FAILED
      break
    case k.DOWNLOAD_START:
      state.purchased.push(load)
      break
    case k.ERROR_PUBLISHING:
      state.published = state.published.slice(0, state.published.length - 1)
      break
    case k.GOT_EARNINGS_AND_REWARDS:
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
      file.status = k.DOWNLOADED_PUBLISHED,
      file.datePublished = new Date
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
    case k.UPDATING_FILE:
      file = findFile(load.did, state.published)
      if(file !== null) {
        file.name = load.name
        file.price = load.price == null ? file.price : load.price
        file.size = load.size == 0 ? file.size : load.size
        file.status = k.UPDATING_FILE
      }
      break
    case k.UPDATED_FILE:
      file = findFile(load, state.published)
      if(file !== null) {
        file.status = k.DOWNLOADED_PUBLISHED
      }
      break
    case k.UPDATE_EARNING:
      file = findFile(load.did, state.published)
      file.earnings = file.earnings += Number(load.earning)
      break
    case k.SET_SIZE:
      file = state.purchased[state.purchased.length - 1]
      file.size = file.size || load.size
      break
    default:
    return state
  }
  return state
}

function findFile(did, files) {
	return files.find(file => file.did === did)
}