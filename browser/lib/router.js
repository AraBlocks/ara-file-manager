'use strict'

const home = require('../views/home')
const confirm = require('../views/confirm')
const choo = require('choo')

module.exports = (app) => {
  app.route('/', home)
  app.route('/confirm', confirm)
}