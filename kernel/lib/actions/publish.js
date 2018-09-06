'use strict'

const debug = require('debug')('acm:kernel:lib:actions:publish')
const afs = require('ara-filesystem')
const { writeFileMetaData } = require('./afsManager')

module.exports = {
  async addCreateEstimate({
    did,
    name,
    password,
    paths,
    price
  }) {
    let arafs
    let id
    let mnemonic
    try {
      arafs = await afs.create({ owner: did, password });
      ({ afs: { did: id }, mnemonic } = arafs)
      arafs.afs.close()
      debug('AFS successfully created')
    } catch (err) {
      debug('Error in creating AFS: %O', err)
    }

    try {
      const newAfs = await afs.add({
        did: id,
        paths: paths,
        password
      })
      newAfs.close()
      debug('Added file succesfully')
    } catch (err) {
      debug('Error adding file to AFS: %O', err)
    }

    writeFileMetaData({
      did: id,
      title: name
    })

    let gasEstimate
    try {
      gasEstimate = await afs.estimateCommitGasCost({ did: id, password })
      debug('Gas estimate for commit: %d', gasEstimate)
      if (price != null) {
        gasEstimate += await afs.estimateSetPriceGasCost({ did: id, password, price: Number(price) })
        debug('Gas estimate for commit + setting price: %d', gasEstimate)
      }

      return {
        did: id,
        mnemonic,
        gasEstimate,
        name,
        paths,
        price
      }
    } catch (err) {
      debug('Error in estimating gas: %O', err)
    }
  },

  async commit({ did, password, gasEstimate, price = null }) {
    try {
      const result = await afs.commit({ did, password, gasEstimate })
      if (price != null) {
        await afs.setPrice({ did, password, price: Number(price) })
        debug('Price set succesfully: %s', price)
      }
      debug('Committed AFS successfully')
      return result
    } catch (err) {
      debug('Error: %O', err)
    }
  }
}