'use strict'

const debug = require('debug')('acm:boot:writeFiles')
const k = require('../lib/constants/networkKeys')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
const { version } = require('../package.json')

module.exports = {
  updateAraRC() {
    const araRCPath = path.resolve(userHome, '.ararc')
    const araRCVersion = `;; Ara File Manager ${version}`
    let fileData
    try {
      fileData = fs.readFileSync(araRCPath, { "encoding": "utf8" })
      if (fileData.split('\n')[0] === araRCVersion) { return false }
    } catch(e) {}
    const araRCData = `${araRCVersion}
;; Ethereum
[web3]
provider=ws://127.0.0.1:8546
network_id=testnet

[web3.privatenet]
provider[]=http://127.0.0.1:8545
provider[]=ws://127.0.0.1:8546

[web3.testnet]
provider[]=wss://ropsten.infura.io/ws

[web3.mainnet]
provider[]=wss://mainnet.infura.io/ws

;; Identity network
[network.identity]
keyring = 'http://keyrings.ara.one/1.0/did:ara:c04562dbf5c3ef3f091633e0482fb1308b8d4496d515b6f0bc73f1a7f95bc0d7/ara-production-public'
secret = 'ara-production'

[network.identity.resolver]
network = resolver1
servers[] = "http://identity1.cafe.network"
servers[] = "https://resolver.ara.one"

[network.identity.archiver]
network = archiver2

[network.dns]
server[] = "discovery1.cafe.network"
server[] = "discovery1.ara.one"
server[] = "8.8.8.8"
server[] = "1.1.1.1"

[network.dht]
bootstrap[] = "discovery1.cafe.network:6881"
bootstrap[] = "discovery1.ara.one:6881"`
    fs.writeFileSync(araRCPath, araRCData)
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