'use strict'
const fs = require('fs')

module.exports = {
  osxSurfaceAids() {
    const cleanDir = __dirname.slice(1)
    const root = '/' + cleanDir.slice(0, cleanDir.indexOf('/'))

    return fs.readdirSync(root).reduce((acc, user) => {
      if (user !== '.localized') {
        try {
          fs.statSync(`${root}/${user}/.ara`)
          const ids = fs.readdirSync(`${root}/${user}/.ara/identities`)
            .reduce((acc, file) =>
              file.length === 64
                ? [...acc, `${root}/${user}/.ara/identities/${file}`]
                : acc, []
            )
          acc = [...acc, ...ids]
        } catch (e) { }
      }
      return acc
    }, [])
  }
}

