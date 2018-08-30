'use strict'

const debug = require('debug')('acms:files')
const {
  DOWNLOADED,
  DOWNLOADING,
  DOWNLOAD_FAILED,
  DOWNLOAD_START,
  PUBLISHED,
  PUBLISHING
} = require('../../../lib/constants/stateManagement')

module.exports = (state, { load, type }) => {
  debug('Old state: %O', state)
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
      file.status = 2
      break
    case DOWNLOAD_FAILED:
      file = state.purchased[state.purchased.length - 1]
      file.downloadPercent = 0
      file.status = 4
      break
    case DOWNLOAD_START:
      state.purchased.push(load)
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
  debug('New state: %O', state)
  return state
}