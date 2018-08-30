'use strict'

const debug = require('debug')('acm:kernel:lib:reducers:dispatch')
const account = require('./account')
const files = require('./files')
const modal = require('./modal')
const state = require('../store')
const windowManager = require('electron-window-manager')

const reducers = [
  { property: 'account', reducer: account },
  { property: 'files', reducer: files },
  { property: 'modal', reducer: modal }
]

module.exports = (action) => reducers.forEach(({ property, reducer }) => {
  return reducer(state[property], action)
})

windowManager.sharedData.set('store', state)


