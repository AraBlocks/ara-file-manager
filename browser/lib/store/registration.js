const context = require('ara-context')()
const aid = require('ara-identity')

module.exports = {
  async register(password) {
    return await aid.create({ context, password })
  }
}

