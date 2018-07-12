'use strict'
const fs = require('fs')

module.exports = {
  osxSurfaceAids() {
    const cleanDir = __dirname.slice(1)
    const root = '/' + cleanDir.slice(0, cleanDir.indexOf('/'))

    return fs.readdirSync(root).reduce((acc, file) => {
      if(file !== '.localized') {
        try {
          fs.statSync(`${root}/${file}/.ara`)
          const ids = fs.readdirSync(`${root}/${file}/.ara/identities`)
            .reduce((acc, file) => file.length === 64 ? [...acc, file] : acc, [])
          acc = [...acc, ...ids]
        } catch (e) {}
      }
      return acc
    }, [])
  }
}

