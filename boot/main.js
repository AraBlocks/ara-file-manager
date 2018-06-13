'use strict'

const isDev = require('electron-is-dev')
require('../kernel/server.js')
if(isDev) { require('electron-reload')(__dirname) }
require('./makeWindow')


