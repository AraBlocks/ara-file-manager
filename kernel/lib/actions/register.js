'use strict'

const context = require('ara-context')()
const aid = require('ara-identity')

const SECRET = 'ara-archiver'
const NAME = 'remote1'
module.exports = {
  async create(password) {
    const araId = await aid.create({ context, password })
    await aid.util.writeIdentity(araId)
    return araId
  },

  async archive(araId) {
    await aid.archive(araId, {
      secret: SECRET,
      name: NAME,
      keyring: `/Users/${process.argv[process.argv.length - 1]}/.ara/secret/ara-archiver.pub`
    })
    return araId.did.reference
  }
}

