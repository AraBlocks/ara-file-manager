'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:subscription')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const { internalEmitter, pingView } = require('electron-window-manager')

internalEmitter.on(k.UPDATE_EARNING, (load) => {
  debug('%s HEARD', k.UPDATE_EARNING)
  try {
    dispatch({ type: k.UPDATE_EARNING, load })
    pingView({ view: 'filemanager', event: k.REFRESH })
  } catch(err) {
    debug('Error: %o', err)
  }
})

internalEmitter.on(k.UPDATE_BALANCE, (load) => {
  debug('%s HEARD', k.UPDATE_BALANCE)
  try {
    dispatch({ type: k.UPDATE_BALANCE, load })
    pingView({ view: 'filemanager', event: k.REFRESH })
    pingView({ view: 'accountInfo', event: k.REFRESH })
  } catch(err) {
    debug('Error: %o', err)
  }
})