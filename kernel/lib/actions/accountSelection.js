'use strict'
const fs = require('fs')
const userHome = require('user-home')

module.exports = {
  osxSurfaceAids() {
    const root = userHome
    return fs.readdirSync(root).reduce((acc, user) => {
      if (user !== '.localized') {
        try {
          fs.statSync(`${root}/.ara`)
          const ids = fs.readdirSync(`${root}/.ara/identities`)
            .reduce((acc, afs) =>
              afs.length === 64
                ? [...acc, {
                    afs,
                    ddo: JSON.parse(fs.readFileSync(`${root}/.ara/identities/${afs}/ddo.json`)),
                    keystore: JSON.parse(fs.readFileSync(`${root}/.ara/identities/${afs}/keystore/eth`))
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