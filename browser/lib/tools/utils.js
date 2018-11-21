'use strict'

module.exports = {
  roundDecimal(number, place) {
    return Math.round(number * place) / place
  },

  shouldShowBanner(network) {
    return network === 'private' || network === 'ropsten'
  }
}