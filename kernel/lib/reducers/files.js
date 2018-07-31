'use strict'

const { DOWNLOADED, DOWNLOADING } = require('../../../lib/constants/stateManagement')
module.exports = (state, { load, type }) => {
  switch (type){
    case DOWNLOADING:
      state.purchased.push(load)
      break
    case DOWNLOADED:
      const file = state.purchased[-1]
      file.downloadPercent = 1
      file.status = 2
      break
    default:
      return state
  }
  return state
}