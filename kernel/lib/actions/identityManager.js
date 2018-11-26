'use strict'

const debug = require('debug')('acm:kernel:lib:actions:register')
const aid = require('ara-identity')
const { DID } = require('did-uri')
const context = require('ara-context')()
const { getAddressFromDID } = require('ara-util')

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
  },

  async getAddressFromDID(did) {
    try {
      const address = getAddressFromDID(did)
      return address
    } catch(err) {
      debug('Error getting address from did: %o', err)
    }
   },

  async recover({ mnemonic, password }) {
    try {
      const araId = await aid.recover({ context, mnemonic, password})
      await aid.util.writeIdentity(araId)
      return araId
    } catch (err) {
      debug('Err recovering identity: %o', err)
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