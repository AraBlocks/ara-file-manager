const debug = require('debug')('afm:kernel:lib:actions:fuseManager')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const { mount: afsMount } = require('cfsnet/fuse')
const mkdirp = require('mkdirp')
const pify = require('pify')
const path = require('path')

async function mount(afs) {
  const { did } = afs
  const mntPath = path.resolve('./mnt', createAFSKeyPath(did).split(path.sep).pop())

  await pify(mkdirp)(mntPath)
  debug(`mounting ${did} at ${mntPath} ...`)

  await afsMount(mntPath, afs, {
    displayFolder: true,
    force: true,
    options: [
      'modules=subdir',
      'subdir=/home'
    ]
  })

  debug('mounted.')
}

module.exports = {
  mount
}
