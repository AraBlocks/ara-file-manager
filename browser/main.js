'use strict'

const chooDevTools = require('choo-devtools')
const choo = require('choo')
const isDev = require('electron-is-dev')

const app = choo()
if(isDev) { app.use(chooDevTools()) }

require('./lib/router')(app)
require('./lib/store')(app)

document.body.appendChild(app.start())

console.log('browser main running')