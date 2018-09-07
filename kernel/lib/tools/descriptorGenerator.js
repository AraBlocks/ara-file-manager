'use strict'

const debug = require('debug')('acm:kernel:lib:tools:descriptorGenerator')
const { AWAITING_DOWNLOAD, DOWNLOADED } = require('../../../lib/constants/stateManagement')
const test = require('../actions/afsManager')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const fs = require('fs')

module.exports = async (did, deeplinkData = null) => {
  console.log({test,AWAITING_DOWNLOAD})
  try {

    did = did.slice(-64)
    const path = await createAFSKeyPath(did)
    const AFSexists = fs.existsSync(path)
    const meta = await readFileMetadata(did)
    
    const descriptor = {}
    descriptor.downloadPercent = AFSexists ? 1 : 0
    descriptor.meta = {
      aid: 'did:ara' + did,
      datePublished: meta ? meta.timestamp : null,
      earnings: 0,
      peers: 0,
      price: Number(await getAFSPrice({ did }))
    }
    descriptor.name = meta ? meta.title : deeplinkData ? deeplinkData.title : null
    descriptor.size = 0
    descriptor.status = AFSexists ? DOWNLOADED : AWAITING_DOWNLOAD
    
    return descriptor
  } catch (err) {
    debug('Error:, %o', err)
  }
}