'use strict'

const debug = require('debug')('afm:kernel:redux:reducers:dispatch')
const application = require('./application')
const account = require('./account')
const files = require('./files')
const farmer = require('./farmer')
const modal = require('./modal')
const subscriptions = require('./subscriptions')
const views = require('./views')
const state = require('../store')
const windowManager = require('electron-window-manager')

const reducers = [
  { property: 'application', reducer: application },
  { property: 'account', reducer: account },
  { property: 'files', reducer: files },
  { property: 'modal', reducer: modal },
  { property: 'subscriptions', reducer: subscriptions },
  { property: 'farmer', reducer: farmer },
  { property: 'views', reducer: views }
]

module.exports = (action) => {
  try {
    if (action.hasOwnProperty('type') === false) {
      throw new TypeError('Dispatch object missing the necessary "type" property')
    } else if (action.type === undefined) {
      throw new TypeError('Value of type property is undefined. You likely forgot to define the constant')
    } else if (action.load && typeof action.load !== 'object') {
      throw new TypeError('Dispatch object load property should be an object')
    }
  } catch (err) {
    debug(err)
  }

  reducers.forEach(({ property, reducer }) => {
    reducer(state[property], action)
  })

  return state
}

windowManager.sharedData.set('store', state)


