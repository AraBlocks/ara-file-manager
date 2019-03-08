const debug = require('debug')('afm:kernel:lib:actions:fuseManager')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const { mount: afsMount } = require('cfsnet/fuse')
const { readFileMetadata } = require('./utils')
const { getAFMDirectory } = require('./afm')
const mkdirp = require('mkdirp')
const pify = require('pify')
const path = require('path')

async function mount(afs) {
  const { did } = afs
  const { title } = await readFileMetadata(did) || createAFSKeyPath(did).split(path.sep).pop()

  const mntPath = path.resolve(path.join(getAFMDirectory(), '/mnt'), title)

  await pify(mkdirp)(mntPath)
  debug(`mounting ${did} at ${mntPath} ...`)

  await afsMount(mntPath, afs, {
    displayFolder: true,
    force: true,
    options: [
      'modules=subdir',
      'subdir=/home',
      `fsname=ara file manager (${title})`
    ]
  })

  debug('mounted.')
}

module.exports = {
  mount
}
