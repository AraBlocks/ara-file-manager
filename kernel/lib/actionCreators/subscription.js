'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:subscription')
const dispatch = require('../reducers/dispatch')
const { UPDATE_EARNING } = require('../../../lib/constants/stateManagement')
const { internalEmitter, pingView } = require('electron-window-manager')

internalEmitter.once(UPDATE_EARNING, async (load) => {
  try {
    debug('Dispatching %s', UPDATE_EARNING)
    dispatch({ type: UPDATE_EARNING, load })
    pingView({ view: 'filemanager', event: UPDATE_EARNING })
  } catch(err) {
    debug('Error: %o', err)
  }
})