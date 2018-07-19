'use strict'

const afs = require('afs')

let arafs
try {
  arafs = await afs.create({ owner, password })//pw is for aid
} catch (err) { onfatal(err) }

try {
  await afs.add({
    did,
    paths,
    password })
  info("file(s) successfully added")
} catch (err) {
  onfatal(err)
}

//cache 12 word pneumonic