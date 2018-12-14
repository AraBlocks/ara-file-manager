'use strict'

const debug = require('debug')('acm:boot:writeFiles')
const k = require('../lib/constants/networkKeys')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')

module.exports = {
  writeAraRC() {
    const araRCPath = path.resolve(userHome, '.ararc')
    if (fs.existsSync(araRCPath) === false) {
      debug('Writing .ararc')
      const araRCData = `
;; Ethereum conf
[web3]
provider = ${k.PROVIDER_SOCKET_ADDRESS};
network_id = ${k.NETWORK_ID};

[web3.testnet]
provider[] = ${k.INFURA_ADDRESS}

;; Identity network configuration
[network.identity]
keyring=${k.KEYRING_URL}

[network.identity.resolver]
secret = ${k.RESOLVER_SECRET}
keyring = ${k.KEYRING_URL}
network = ${k.RESOLVER_NETWORK}

[network.identity.archiver]
secret = ${k.ARCHIVER_SECRET}
keyring = ${k.KEYRING_URL}
network = ${k.ARCHIVER_NETWORK}

[network.dns]
server = ${k.NETWORK_DNS}

[network.dht]
bootstrap = ${k.NETWORK_DHT}`

      fs.writeFileSync(araRCPath, araRCData)

      return true
    }
    return false
  },

  writeDotAra() {
    const dotAraPath = path.resolve(userHome, '.ara')
    if (fs.existsSync(dotAraPath) === false) {
      debug('Writing .ara')
      fs.mkdirSync(dotAraPath)
      return true
    } else {
      return false
    }
   }
}