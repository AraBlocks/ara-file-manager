'use strict'

const debug = require('debug')('acm:kernel:lib:actions:publish')
const afs = require('ara-filesystem')
const { writeFileMetaData } = require('./afsManager')
const fs = require('fs')

module.exports = {
  async addCreateEstimate({
    fileAid = null,
    userAid,
    name,
    password,
    paths,
    price
  }) {
    let arafs
    let mnemonic

    if (fileAid == null) {
      try {
        arafs = await afs.create({ owner: userAid, password });
        mnemonic = arafs.mnemonic
        fileAid = arafs.afs.did
        arafs.afs.close()
        debug('AFS successfully created')
      } catch (err) {
        debug('Error in creating AFS: %O', err)
        return null
      }
    }

    try {
      const newAfs = await afs.add({
        did: fileAid,
        paths: paths,
        password
      })
      newAfs.close()
      debug('Added file succesfully')
    } catch (err) {
      debug('Error adding file to AFS: %O', err)
      return null
    }

    let size = 0
    paths.forEach(file => {
      const fileStats = fs.statSync(file)
      size += fileStats.size
    })
    debug('File size is %s', size)

    writeFileMetaData({
      did: fileAid,
      size,
      title: name
    })

    let gasEstimate
    try {
      debug('Getting gas estimate..')
      gasEstimate = await afs.estimateCommitGasCost({ did: fileAid, password })
      debug('Gas estimate for commit: %d', gasEstimate)
      if (price != null) {
        gasEstimate += await afs.estimateSetPriceGasCost({ did: fileAid, password, price: Number(price) })
        debug('Gas estimate for commit + setting price: %d', gasEstimate)
      }

      return {
        did: fileAid,
        mnemonic,
        gasEstimate,
        name,
        paths,
        price,
        size
      }
    } catch (err) {
      debug('Error in estimating gas: %O', err)
      return null
    }
  },

  async setPriceGasEstimate({
    fileAid,
    name,
    password,
    price
  }) {
    if (price == null) {
      debug('No price to be set.')
      return
    }
    try {
      const gasEstimate = await afs.estimateSetPriceGasCost({ did: fileAid, password, price: Number(price) })
      debug('Gas estimate for setting price: %d', gasEstimate)
      return {
        did: fileAid,
        gasEstimate,
        name,
        price,
        paths: []
      }
    } catch(e) {
      debug(e)
    }
  },

  async setPrice({ did, password, price }) {
    try {
      if (price != null) {
        await afs.setPrice({ did, password, price: Number(price) })
        debug('Price set succesfully: %s', price)
      }
    } catch(err) {
      debug('Error: %O', err)
    }
  },

  async commit({ did, password, gasEstimate, price = null }) {
    debug('Committing AFS')
    try {
      const result = await afs.commit({ did, password, gasEstimate })
      await this.setPrice({ did, password, price })
      debug('Committed AFS successfully')
      return result
    } catch (err) {
      debug('Error: %O', err)
    }
    debug('Committed AFS successfully')
    return result
  }
}