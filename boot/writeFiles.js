const debug = require('debug')('ara:fm:boot:writeFiles')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')

module.exports = {
  writeDotAra() {
    const dotAraPath = path.resolve(userHome, '.ara')
    if (fs.existsSync(dotAraPath) === false) {
      debug('Writing .ara')
      fs.mkdirSync(dotAraPath)
      return true
    } else {
      return false
    }
   }
}