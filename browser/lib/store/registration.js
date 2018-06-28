const context = require('ara-context')()
const aid = require('ara-identity')
console.log(aid.util)
module.exports = {
  async register(password) {
    const araId = await aid.create({ context, password })
    await aid.util.writeIdentity(araId)
    return araId
  }
}

