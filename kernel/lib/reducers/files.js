'use strict'

const {
  AWAITING_DOWNLOAD,
  CLEAN_UI,
  DOWNLOADED,
  DOWNLOADING,
  DOWNLOAD_FAILED,
  DOWNLOADED_PUBLISHED,
  DOWNLOAD_START,
  ERROR_PUBLISHING,
  GETTING_USER_DATA,
  GOT_EARNINGS,
  GOT_LIBRARY,
  LOGOUT,
  PUBLISHED,
  PUBLISHING,
  PURCHASED,
  PURCHASING,
  UPDATED_FILE,
  UPDATING_FILE,
  UPDATE_EARNING
} = require('../../../lib/constants/stateManagement')

module.exports = (state, { load = null, type }) => {
  let file
  switch (type){
    case DOWNLOADING:
      file = state.purchased[state.purchased.length - 1]
      file.downloadPercent = load.downloadPercent
      file.size = load.size || file.size
      break
    case DOWNLOADED:
      file = state.purchased[state.purchased.length - 1]
      file.downloadPercent = 1
      file.status = DOWNLOADED_PUBLISHED
      break
    case DOWNLOAD_FAILED:
      file = state.purchased[state.purchased.length - 1]
      file.downloadPercent = 0
      file.status = DOWNLOAD_FAILED
      break
    case DOWNLOAD_START:
      state.purchased.push(load)
      break
    case ERROR_PUBLISHING:
      state.published = state.published.slice(0, state.published.length - 1)
      break
    case GOT_EARNINGS:
      state.published = load
      break
    case GOT_LIBRARY:
      state.loadingLibrary = false
      state.published = load.published
      state.purchased = load.purchased
      break
    case GETTING_USER_DATA:
      state.loadingLibrary = true
      break
    case LOGOUT:
    case CLEAN_UI:
      state.published = []
      state.purchased = []
      state.loadingLibrary = false
      break
    case PUBLISHING:
      state.published.push(load)
      break
    case PUBLISHED:
      file = state.published[state.published.length - 1]
      file.downloadPercent = 1
      file.status = DOWNLOADED_PUBLISHED
      file.datePublished = new Date
      break
    case PURCHASING:
      state.purchased.push(load)
      break
    case PURCHASED:
      file = state.purchased[state.purchased.length - 1]
      file.status = AWAITING_DOWNLOAD
      break
    case UPDATING_FILE:
      file = findFile(load.aid, state.published)
      if(file !== null) {
        file.name = load.name
        file.price = load.price == null ? file.price : load.price
        file.size = load.size == 0 ? file.size : load.size
        file.status = UPDATING_FILE
      }
      break
    case UPDATED_FILE:
      file = findFile(load, state.published)
      if(file !== null) {
        file.status = DOWNLOADED_PUBLISHED
      }
      break
    case UPDATE_EARNING:
      file = findFile(load.did, state.published)
      file.earnings = file.earnings += Number(load.earning)
      break
    default:
    return state
  }
  return state
}

function findFile(aid, files) {
	return files.find(({ did }) => did === aid)
}