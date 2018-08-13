'use strict'

const afs = require('ara-filesystem')

module.exports = {
  async addCreateEstimate({
    did,
    name,
    password,
    paths,
    price
  }) {
    paths = paths[0].slice(paths[0].lastIndexOf('/') + 1)

    const arafs = await afs.create({ owner: did, password })
    const { afs: { did: id }, mnemonic } = arafs
    arafs.afs.close()

    try {
      await afs.add({
        did: id,
        paths: [ paths ],
        password
      })
      console.log('added file succesfully')
    } catch (e) {
      console.warn('error in adding')
    }

    let gasEstimate
    try {
      gasEstimate = await afs.estimateCommitGasCost({ did: id, password })
    } catch (err) {
      console.log({ err })
    }

    return {
      did: id,
      mnemonic,
      gasEstimate,
      name,
      paths,
      price
    }
  },

  async commit({ did, password, gasEstimate, price }){
    const result = await afs.commit({ did, password, gasEstimate })
    if (result instanceof Error) {
      console.log(result)
    } else {
      console.log("file(s) successfully committed")
      afs.setPrice({ did, password, price: Number(price) }).catch(
        console.log('failed to set price')
      )
    }
    return result
  }
}