'use strict'

const context = require('ara-context')()
const aid = require('ara-identity')
const secrets = require('ara-network/secrets')

const KEY = 'resolver'

module.exports = {
  async resolveAid(did) {

    let keystore = null
    const doc = await secrets.load({ key: KEY })
    if (doc.public) { keystore = doc.public.keystore }
    else if (doc.secret) { keystore = doc.public.keystore }

    const identity = await aid.resolve(did, {
      context,
      keystore,
      timeout: undefined,
      key: KEY,
      cache: true
    })

    return identity
  }
}