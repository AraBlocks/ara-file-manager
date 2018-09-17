'use strict'

const context = require('ara-context')()
const aid = require('ara-identity')
const secrets = require('ara-network/secrets')

const KEY = 'archiver'
module.exports = {
  async create(password) {
    const araId = await aid.create({ context, password })
    await aid.util.writeIdentity(araId)
    return araId
  },

  async archive(araId) {
    const doc = await secrets.load({ key: KEY })

    const { keystore } = doc.public || doc.secret
    await aid.archive(araId, { keystore, key: KEY })
    return araId.did.reference
  }
}

