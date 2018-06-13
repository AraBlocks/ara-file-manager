'use strict'

const home = require('../views/home')
const choo = require('choo')

module.exports = (app) => {
  app.route('/', home)
}