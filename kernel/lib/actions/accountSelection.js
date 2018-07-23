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
            .reduce((acc, afs) =>
              afs.length === 64
                ? [...acc, {
                    afs,
                    ddo: JSON.parse(fs.readFileSync(`${root}/${user}/.ara/identities/${afs}/ddo.json`)),
                    keystore: JSON.parse(fs.readFileSync(`${root}/${user}/.ara/identities/${afs}/keystore/eth`))
                  }]
                : acc, []
            )
          acc = [...acc, ...ids]
        } catch (e) { }
      }
      return acc
    }, [])
  }
}