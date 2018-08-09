'use strict'

const {
  DOWNLOADED,
  DOWNLOADING,
  DOWNLOAD_FAILED,
  PUBLISHED,
  PUBLISHING
} = require('../../../lib/constants/stateManagement')

module.exports = (state, { load, type }) => {
  let file
  switch (type){
    case DOWNLOADING:
      state.purchased.push(load)
      break
    case DOWNLOADED:
      file = state.purchased[state.purchased.length - 1]
      file.downloadPercent = 1
      file.status = 2
      state.userBalance = state.userBalance - load
      break
    case DOWNLOAD_FAILED:
      file = state.purchased[state.purchased.length - 1]
      file.downloadPercent = 0
      file.status = 4
      break
    case PUBLISHING:
      state.published.push(load)
      break
    case PUBLISHED:
      file = state.published[state.published.length - 1]
      file.downloadPercent = 1
      file.status = 2
      file.meta.datePublished = new Date
    default:
      return state
  }
  return state
}