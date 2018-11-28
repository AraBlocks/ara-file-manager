'use strict'

const debug = require('debug')('acm:kernel:lib:actions:register')
const aid = require('ara-identity')
const { DID } = require('did-uri')
const createContext = require('ara-context')

module.exports = {
  async create(password) {
    const context = createContext()
    await context.ready()
    try {
      const araId = await aid.create({ context, password })
      await aid.util.writeIdentity(araId)

      context.close()
      return araId
    } catch(e) {
      debug(e)
      context.close()
    }
  },

  async archive(araId) {
    try {
      await aid.archive(araId, { timeout: 600000})
    } catch(err) {
      debug('Error archiving: ', err)
    }
    return araId.did.reference
  },

  async recover({ mnemonic, password }) {
    const context = createContext()
    await context.ready()
    try {
      const araId = await aid.recover({ context, mnemonic, password})
      await aid.util.writeIdentity(araId)

      context.close()
      return araId
    } catch (err) {
      debug('Err recovering identity: %o', err)
      context.close()
    }
  },

  isValidDid(did) {
    try {
      const normalizedDid = aid.did.normalize(did)
      if (normalizedDid.length === 72) {
        new DID(normalizedDid)
        return true
      }
      return false
    } catch(e) {
      return false
    }
  }
}