'use strict'

const { DOWNLOADED, DOWNLOADING } = require('../../../lib/constants/stateManagement')
module.exports = (state, { load, type }) => {
  switch (type){
    case DOWNLOADING:
      state.purchased = load.purchased
    case DOWNLOADED:
      state.purchased = load.purchased
  }
  return state
}