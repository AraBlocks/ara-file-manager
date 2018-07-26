'use strict'

const state = require('../store')
const account = require('./account')
const files = require('./files')
const isDev = require('electron-is-dev')

const reducers = [
  { property: 'account', reducer: account },
  { property: 'files', reducer: files }
]

module.exports = (action) => reducers.forEach(({ property, reducer }) => {
  return reducer(state[property], action)
})


const windowManager = require('electron-window-manager')
windowManager.sharedData.set('store', state)


