'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:subscription')
const dispatch = require('../reducers/dispatch')
const { UPDATE_EARNING, UPDATE_BALANCE } = require('../../../lib/constants/stateManagement')
const { internalEmitter, pingView } = require('electron-window-manager')

internalEmitter.on(UPDATE_EARNING, async (load) => {
  try {
    debug('Dispatching %s', UPDATE_EARNING)
    dispatch({ type: UPDATE_EARNING, load })
    pingView({ view: 'filemanager', event: UPDATE_EARNING })
  } catch(err) {
    debug('Error: %o', err)
  }
})

internalEmitter.on(UPDATE_BALANCE, async (load) => {
  try {
    debug('Dispatching %s', UPDATE_BALANCE)
    dispatch({ type: UPDATE_BALANCE, load })
    pingView({ view: 'filemanager', event: UPDATE_BALANCE })
  } catch(err) {

  }
})