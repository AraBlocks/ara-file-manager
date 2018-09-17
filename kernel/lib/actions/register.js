'use strict'

const debug = require('debug')('acm:kernel:lib:actions:register')
const context = require('ara-context')()
const aid = require('ara-identity')

const SECRET = 'bills!'
const NAME = 'lara.archiver'
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
        network: NAME,
        keyring: 'http://45.33.29.246:3000/keyring.pub',
        timeout: 600000
      })
    } catch(e) {
      debug(e)
    }
    return araId.did.reference
  }
}