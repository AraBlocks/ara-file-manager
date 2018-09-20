'use strict'

const {
  AWAITING_DOWNLOAD,
  DOWNLOADED,
  DOWNLOADING,
  DOWNLOAD_FAILED,
  DOWNLOADED_PUBLISHED,
  DOWNLOAD_START,
  GOT_EARNINGS,
  GOT_LIBRARY,
  PUBLISHED,
  PUBLISHING,
  PURCHASED,
  PURCHASING,
  UPDATE,
  UPDATED,
  UPDATING,
  UPDATE_EARNING
} = require('../../../lib/constants/stateManagement')

module.exports = (state, { load, type }) => {
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
    case GOT_EARNINGS:
      state.published = load
      break
    case GOT_LIBRARY:
      state.published = load.published
      state.purchased = load.purchased
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
    case UPDATING:
      file = findFile(load.aid, state.published)
      if(file !== null) {
        file.name = load.name
        file.price = load.price
        file.size = load.size
        file.status = UPDATING
      }
      break
    case UPDATED:
      file = findFile(load, state.published)
      if(file !== null) {
        file.status = DOWNLOADED_PUBLISHED
      }
      break
    case UPDATE_EARNING:
      file = state.published.find(({ did }) => did === load.did)
      file.earnings = file.earnings += Number(load.earning)
      break
    default:
    return state
  }
  return state
}

function findFile(aid, files) {
	const index = files.findIndex((file) => file.meta.aid === aid)
	if (index !== -1) {
		return files[index]
	}
	return null
}