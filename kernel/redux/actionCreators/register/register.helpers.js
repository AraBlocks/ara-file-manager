const debug = require('debug')('afm:kernel:lib:actionCreators:register')
const { utils } = require('../../actions')

async function requestEther(ethAddress) {
  try {
    debug('Requesting from main eth faucet')
    await utils.requestEthFaucet(ethAddress)
  } catch (err) {
    debug('Error requesting from main eth faucet: %s', err.message)
    try {
      debug('Requesting from fallback eth faucet')
      await utils.requestFallbackEthFaucet(ethAddress)
    } catch (err) {
      debug('Error requesting from fallback eth faucet: %s', err.message)
    }
  }
}

module.exports = {
  requestEther
}