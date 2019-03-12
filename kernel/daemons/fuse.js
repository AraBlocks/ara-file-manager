const debug = require('debug')('afm:kernel:lib:actions:fuseManager')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const { mount: afsMount } = require('cfsnet/fuse')
const { readFileMetadata } = require('./utils')
const { getAFMDirectory } = require('./afm')
const onExit = require('async-exit-hook')
const { umount } = require('umount')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const pify = require('pify')
const path = require('path')

async function mount(afs) {
  const { did } = afs
  const { title } = await readFileMetadata(did) || createAFSKeyPath(did).split(path.sep).pop()

  const mntPath = path.resolve(path.join(getAFMDirectory(), '/mnt'), title)

  debug(`mounting ${did} at ${mntPath} ...`)

  await clean()
  await pify(mkdirp)(mntPath)

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

  onExit(async (done) => {
    await clean()
    done()
  })

  async function clean() {
    debug('cleaning')
    try{
      await pify(umount)(mntPath)
    } catch (err) {
      debug(err.message)
    }

    try {
      await pify(rimraf)(mntPath)
    } catch (err) {
      debug(err.message)
    }
    debug('cleaned.')
  }
}

module.exports = {
  mount
}
