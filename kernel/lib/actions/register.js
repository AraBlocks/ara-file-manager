'use strict'

const debug = require('debug')('acm:kernel:lib:actions:register')
const aid = require('ara-identity')
const context = require('ara-context')()

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
      await aid.archive(araId, { timeout: 600000})
    } catch(err) {
      debug('Error archiving: ', err)
    }
    return araId.did.reference
  }
}