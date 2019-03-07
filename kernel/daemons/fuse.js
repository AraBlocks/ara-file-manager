const debug = require('debug')('afm:kernel:lib:actions:fuseManager')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const actionsUtil = require('./utils')
const fuse = require('fuse-bindings')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const pify = require('pify')
const path = require('path')

async function mount(afs) {
  const did = afs.did
  let mntPath = createAFSKeyPath(did).split(path.sep).pop()

  const D = (fmt, ...args) => debug(
    `mount: %s -> %s: ${fmt}`,
    mntPath,
    afs.did,
    ...args
  )

  await pify(fuse.unmount)(mntPath)
  await pify(mkdirp)(mntPath)
  D(`mounting at ${mntPath}...`)
  await pify(fuse.mount)(mntPath, {
    force: true,
    displayFolder: true,

    open,
    read,
    access,
    readdir,
    statfs,
    getattr,
    release
  }, cb)
  D('mounted.')

  function open(path, flags, cb) {
    path = actionsUtil.homepartition(path, afs.HOME)
    D('open(%s, %d)', path, flags)

    afs.open(path, flags, cb)
  }

  function read(path, fd, buf, len, pos, cb) {
    path = actionsUtil.homepartition(path, afs.HOME)
    D('\t\t\t\t\t\t\t\t\t\t\t\tread(%s, %d, %d, %d)', path, fd, len, pos)

    // afs.partitions.home.open(path, cb)
    afs.read(fd, buf, 0, len, pos, cb)
    afs.read(fd, buf, 0, len, pos, console.log)
    // afs.readFile(path, { start: pos, end: pos + len }, cb)
    // afs.readFile(path, { start: pos, end: pos + len }, console.log)
    // afs.readFile(path, { length: len }, cb)
  }

  function access(path, mode, cb) {
    path = actionsUtil.homepartition(path, afs.HOME)
    D('access: (%s, %s)', path, mode)

    afs.access(path, mode, cb)
  }

  function readdir(path, cb) {
    path = actionsUtil.homepartition(path, afs.HOME)
    D('readdir(%s)', path)

    afs.readdir(path, cb)
    afs.readdir(path, console.log)
  }

  function statfs(path, cb) {
    path = actionsUtil.homepartition(path, afs.HOME)
    D('statfs(%s)', path)

    afs.stat(path, cb)
  }

  function getattr(path, cb) {
    path = actionsUtil.homepartition(path, afs.HOME)
    D('getattr(%s)', path)

    afs.stat(path, cb)
  }

  function release(path, fd, cb) {
    path = actionsUtil.homepartition(path, afs.HOME)
    D('release(%s, %d)', path, fd)

    afs.close(fd, cb)
  }

  function cb(error) {
    if (error) console.error(' failed to mount:', error)
  }
}

module.exports = {
  mount
}
