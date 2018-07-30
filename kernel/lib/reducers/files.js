'use strict'

const { DOWNLOADED, DOWNLOADING } = require('../../../lib/constants/stateManagement')

module.exports = (state, { load, type }) => {
  switch (type){
    case DOWNLOADING:
      state.purchased.push(load)
      break
    case DOWNLOADED:
      const file = state.purchased[state.purchased.length - 1]
      file.downloadPercent = 1
      file.status = 2
      break
    case PUBLISHING:
      state.published.push(load)
      break
    case PUBLISHED:
      const file = state.published[state.published.length - 1]
      file.downloadPercent = 1
      file.status = 2
      file.meta.datePublish = new Date
    default:
      return state
  }
  return state
}