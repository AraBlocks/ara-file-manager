'use strict'

const debug = require('debug')('acm:kernel:lib:actions:register')
const aid = require('ara-identity')
const context = require('ara-context')()
const { ARCHIVER_NAME, SECRET } = require('../../../lib/constants/networkKeys')
const userHome = require('user-home')

module.exports = {
  async create(password) {
    try {
      const araId = await aid.create({ context, password })
      await aid.util.writeIdentity(araId)
      return araId
    } catch(e) {
      debug(e)
    }
  },

  async archive(araId) {
    try {
      await aid.archive(araId, {
        secret: SECRET,
        network: ARCHIVER_NAME,
        keyring: path.resolve(userHome, '.ara', 'keyrings', 'keyring.pub'),
        timeout: 600000
      })
    } catch(e) {
      debug(e)
    }
    return araId.did.reference
  }
}