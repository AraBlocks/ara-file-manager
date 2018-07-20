// 'use strict'

// const afs = require('ara-filesystem')
// const owner = 'did:ara:2769d1e0c0d7a1cb6b3c766de2c5da23e5fb9b214832c610bf1701ffa643351b'
// const password = 'abc'
// void async function () {
//   //create did:ara:2769d1e0c0d7a1cb6b3c766de2c5da23e5fb9b214832c610bf1701ffaf1701ffa643351b
//   const arafs = await afs.create({ owner, password })//pw is for aid
//   //cache mnemonic & did
//   console.log(arafs.mnemonic)
//   console.log(arafs.afs.did)

//   const did = arafs.afs.did
//   arafs.afs.close()
//   //afs add 518f6e8b1df7e7c2ef8a994d094aef8a5523680ca1c9f5b5b8c7e7c7d6981276 test.html
//   try {
//     await afs.add({
//       did,
//       paths: ['build'],
//       password
//     })
//     console.log('added file succesfully')
//   } catch (e) {
//     console.warn('error in adding')
//   }

//   let price
//   try {
//     price = await afs.estimateCommitGasCost({ did, password })
//     console.log({ price })
//   } catch (err) {
//     console.log({ err })
//   }
//   //cache cost


//   const result = await afs.commit({ did, password, price })
//   if (result instanceof Error) {
//     console.warn(result)
//   } else {
//     console.log("file(s) successfully committed")
//     return null
//   }
// }()

const { argv } = require('yargs')
const identityArchiver = require('ara-network-node-identity-archiver')
const rc = require('ara-runtime-configuration')

void async function main() {
  try { await identityArchiver.configure(rc.network.node['identity-archiver'], require('yargs')) }
  catch (err) { await identityArchiver.configure({keys:, require('yargs')) }
  try {
    await identityArchiver.start(argv)
  } catch (e) {
    console.log({e})
  }
}()