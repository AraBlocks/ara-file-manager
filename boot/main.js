'use strict'
const path = require('path')
const isDev = require('electron-is-dev')

void async function() {
  const window = await require('./makeWindow')
  require('../kernel/server.js')(window)
  if (isDev) { require('electron-reload')(path.resolve('browser')) }
}()


