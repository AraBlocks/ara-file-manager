'use strict'

const debug = require('debug')('acm:boot:writeFiles')
const k = require('../lib/constants/networkKeys')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')

module.exports = () => {
  const araPath = path.resolve(userHome, '.ara')
  if (fs.existsSync(araPath) === false) {
    debug('Creating .ara directory')
    fs.mkdirSync(araPath)

    debug('Creating keyrings directory')
    const keyringPath = path.resolve(userHome, '.ara', 'keyrings')
    fs.mkdirSync(keyringPath)

    debug('Writing node public key')
    const pubKeyPath = path.resolve(userHome, '.ara', 'keyrings', k.NODE_PUBLIC_KEY_NAME)
    const pubKeyData = fs.readFileSync(path.resolve(__dirname, '..', 'lib', 'keyrings', 'keyring.pub'))
    fs.writeFileSync(pubKeyPath, pubKeyData)

    return true
  }
  return false
}