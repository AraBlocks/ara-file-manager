const context = require('ara-context')()
const aid = require('ara-identity')
const secrets = require('ara-network/secrets')

const key = 'archiver'
module.exports = {
  async createId(password) {
    const araId = await aid.create({ context, password })
    await aid.util.writeIdentity(araId)
    return araId
  },

  async archive(identity) {
    const doc = await secrets.load({ key })

    const { keystore } = doc.public || doc.secret
    return await aid.archive(identity, { keystore, key })
  }
}

