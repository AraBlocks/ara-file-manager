module.exports = {
  roundDecimal(number, place) {
    return Math.ceil(number * place) / place
  },

  shouldShowBanner(network) {
    return network === 'private' || network === 'ropsten'
  }
}