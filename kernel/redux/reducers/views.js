const { events } = require('k')

module.exports = (state, { load = null, type }) => {
  switch (type) {
    case events.FEED_ESTIMATE_SPINNER:
      state.estimateSpinner.did = load.did
      state.estimateSpinner.type = load.type
    break
    default:
      return state
  }
}