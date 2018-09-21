'use strict'

const {
  CHANGE_BROADCASTING_STATE
 } = require('../../../lib/constants/stateManagement')

 module.exports = (state, { load, type }) => {
  switch(type) {
		case CHANGE_BROADCASTING_STATE:
      state.isBroadcasting = load
      break
    default:
    return state
  }
  return state
}