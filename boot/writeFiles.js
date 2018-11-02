'use strict'

const debug = require('debug')('acm:boot:writeFiles')
const k = require('../lib/constants/networkKeys')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')

module.exports = {
  writeRoot() {
    const araPath = path.resolve(userHome, '.ara')
    if (fs.existsSync(araPath) === false) {
      debug('Creating .ara directory')
      fs.mkdirSync(araPath)

      debug('Creating keyrings directory')
      const keyringPath = path.resolve(userHome, '.ara', 'keyrings')
      fs.mkdirSync(keyringPath)

      debug('Writing node public key')
      const pubKeyPath = path.resolve(userHome, '.ara', 'keyrings', k.NODE_PUBLIC_KEY_NAME)
      const pubKeyData = fs.readFileSync(path.resolve(__dirname, '..', 'lib', 'keyrings', k.KEYRING_NAME))
      fs.writeFileSync(pubKeyPath, pubKeyData)

      return true
    }
    return false
  },

  writeAraRC() {
    const araRCPath = path.resolve(userHome, '.ararc')
    if (fs.existsSync(araRCPath) === false) {
      debug('Writing .ararc')
      const keyringPath = path.resolve(userHome, '.ara', 'keyrings', k.KEYRING_NAME)
      const araRCData = `
        ;; Ethereum conf
        [web3]
        provider = ${k.PROVIDER_SOCKET_ADDRESS};
        provider = ${k.PROVIDER_HTTP_ADDRESS};
        network_id = ${k.NETWORK_ID};

        ;; Identity network configuration
        [network.identity]
        keyring=${keyringPath}

        [network.identity.resolver]
        secret = ${k.RESOLVER_SECRET}
        keyring = ${keyringPath}
        network = ${k.RESOLVER_NETWORK}

        [network.identity.archiver]
        secret = ${k.ARCHIVER_SECRET}
        keyring = ${keyringPath}
        network = ${k.RESOLVER_NETWORK}

        [network.dns]
        server = ${k.NETWORK_DNS}

        [network.dht]
        bootstrap = ${k.NETWORK_DHT}
      `
      fs.writeFileSync(araRCPath, araRCData)

      return true
    }
    return false
  }
}