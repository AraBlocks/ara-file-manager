'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:subscription')
const dispatch = require('../reducers/dispatch')
const { REFRESH, UPDATE_EARNING, UPDATE_BALANCE } = require('../../../lib/constants/stateManagement')
const { internalEmitter, pingView } = require('electron-window-manager')

internalEmitter.on(UPDATE_EARNING, (load) => {
  debug('Dispatching %s', UPDATE_EARNING)
  try {
    debug(load)
    dispatch({ type: UPDATE_EARNING, load })
    pingView({ view: 'filemanager', event: REFRESH })
  } catch(err) {
    debug('Error: %o', err)
  }
})

internalEmitter.on(UPDATE_BALANCE, (load) => {
  debug('Dispatching %s', UPDATE_BALANCE)
  try {
    dispatch({ type: UPDATE_BALANCE, load })
    pingView({ view: 'filemanager', event: REFRESH })
  } catch(err) {
    debug('Error: %o', err)
  }
})