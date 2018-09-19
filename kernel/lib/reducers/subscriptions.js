'use strict'

const {
  GOT_PUBLISHED_SUB,
  GOT_PUBLISHED_SUBS,
} = require('../../../lib/constants/stateManagement')

module.exports = (state, { load, type }) => {
  switch (type) {
    case GOT_PUBLISHED_SUBS:
      state.published.push(...load)
      break
    case GOT_PUBLISHED_SUB:
      state.published.push(load)
    default:
      return state
  }
  return state
}