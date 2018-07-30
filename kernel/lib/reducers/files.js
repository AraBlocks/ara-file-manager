'use strict'

const { DOWNLOADED, DOWNLOADING } = require('../../../lib/constants/stateManagement')
module.exports = (state, { load, type }) => {
  switch (type){
    case DOWNLOADING:
      state.purchased.push(load)
      break
    case DOWNLOADED:
      for (file of state.purchased) {
        if(file.meta.aid === load) {
          console.log(file)
        }
      }
      break
    default:
      return state
  }
  return state
}