'use strict'

const dispatch = require('../reducers/dispatch')
const { DUMP_MODAL_STATE } = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')

ipcMain.on(DUMP_MODAL_STATE, () => dispatch({ type: DUMP_MODAL_STATE }))