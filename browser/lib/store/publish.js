'use strict'

const afs = require('ara-filesystem')
console.log({afs})
const owner = 'did:ara:2769d1e0c0d7a1cb6b3c766de2c5da23e5fb9b214832c610bf1701ffa643351b'
const password = 'abc'
void async function() {
  //create did:ara:2769d1e0c0d7a1cb6b3c766de2c5da23e5fb9b214832c610bf1701ffaf1701ffa643351b
  const arafs = await afs.create({ owner, password })//pw is for aid
  //cache mnemonic & did
  console.log(arafs.mnemonic)
  console.log(arafs.afs.did)

  const did = arafs.afs.did
  arafs.afs.close()
  //afs add 518f6e8b1df7e7c2ef8a994d094aef8a5523680ca1c9f5b5b8c7e7c7d6981276 test.html
try {
  await afs.add({
    did,
    paths: ['build'],
    password
  })
  console.log('added file succesfully')
} catch (e) {
  console.warn('error in adding')
}


  // //afs commit 518f6e8b1df7e7c2ef8a994d094aef8a5523680ca1c9f5b5b8c7e7c7d6981276
  try {
    const cost = await afs.estimateCommitGasCost({ did, password })
    console.log({cost})
  } catch (err) {
    console.log({err})
  }
  // //returns cost
  // //cache cost

  // if (result) {
  //   info("committing with identity: %s", did)
  //   const result = await afs.commit({ did, password, price })
  //   if (result instanceof Error) {
  //     onfatal(result)
  //   } else {
  //     info("file(s) successfully committed")
  //   }
  // } else {
  //   onfatal() // exit
  // }
  // //returns null
}()