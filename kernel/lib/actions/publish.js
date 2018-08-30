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

    const arafs = await afs.create({ owner: did, password })
    const { afs: { did: id }, mnemonic } = arafs
    arafs.afs.close()

    try {
      const newAfs = await afs.add({
        did: id,
        paths: paths,
        password
      })
      newAfs.close()
      console.log('added file succesfully')
    } catch (e) {
      console.warn('error in adding')
    }

    let gasEstimate
    try {
      gasEstimate = await afs.estimateCommitGasCost({ did: id, password })
      if (price != null) {
        gasEstimate += await afs.estimateSetPriceGasCost({ did: id, password, price: Number(price) })
      }
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

  async commit({ did, password, gasEstimate, price = null }){
    console.log('committing')
    let result
    try {
      result = await afs.commit({ did, password, gasEstimate })
      console.log(result)
    } catch(e) {
      console.log(e)
    }
    if (result instanceof Error) {
      console.log(result)
    } else {
      console.log("file(s) successfully committed")
      if (price != null) {
        try {
          await afs.setPrice({ did, password, price: Number(price) })
        } catch (err) {
          console.log(err)
        }
      }
    }
    return result
  }
}