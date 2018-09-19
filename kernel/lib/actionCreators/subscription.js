'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:subscription')
const dispatch = require('../reducers/dispatch')
const { UPDATE_EARNING } = require('../../../lib/constants/stateManagement')
// const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')

internalEmitter.once(UPDATE_EARNING, async (load) => { debug(load)})