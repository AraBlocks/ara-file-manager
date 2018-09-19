'use strict'

const account = require('./account')
const files = require('./files')
const modal = require('./modal')
const subscriptions = require('./subscriptions')
const state = require('../store')
const windowManager = require('electron-window-manager')

const reducers = [
  { property: 'account', reducer: account },
  { property: 'files', reducer: files },
  { property: 'modal', reducer: modal },
  { property: 'subscriptions', reducer: subscriptions }
]

module.exports = (action) => {
  reducers.forEach(({ property, reducer }) => {
    reducer(state[property], action)
  })
  return state
}

windowManager.sharedData.set('store', state)


