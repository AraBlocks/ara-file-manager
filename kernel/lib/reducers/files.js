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
  UPDATE_EARNING
} = require('../../../lib/constants/stateManagement')

module.exports = (state, { load, type }) => {
  let file
  // let x = state.published.find(({ meta }) => meta.aid === '341abebb7764875be968572af63556f6c6e24fb6fef23cd47ae97a589f65a09')
  // let  = state.published.find(({ meta }) => meta.aid === '341abebb7764875be968572af63556f6c6e24fb6fef23cd47ae97a589f65a091' )
  // console.log(x)

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
      file.meta.datePublished = new Date
      break
    case PURCHASING:
      state.purchased.push(load)
      break
    case PURCHASED:
      file = state.purchased[state.purchased.length - 1]
      file.status = AWAITING_DOWNLOAD
      break
    case UPDATE_EARNING:
      file = state.published.find(({ meta }) => meta.aid === load.did)
      file.meta.earnings = file.meta.earnings += Number(load.earning)
      break
    default:
    return state
  }
  return state
}