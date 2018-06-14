'use strict'
const path = require('path')
const isDev = require('electron-is-dev')
require('../kernel/server.js')

if (isDev) { require('electron-reload')(path.resolve('browser')) }
require('./makeWindow')


