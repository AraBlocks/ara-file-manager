'use strict'

const {
  CHANGE_BROADCASTING_STATE,
  LOGOUT
 } = require('../../../lib/constants/stateManagement')

 module.exports = (state, { load = null, type }) => {
  switch(type) {
		case CHANGE_BROADCASTING_STATE:
      state.isBroadcasting = load
      break
    case LOGOUT:
      state.isBroadcasting = false
      break
    default:
    return state
  }
  return state
}