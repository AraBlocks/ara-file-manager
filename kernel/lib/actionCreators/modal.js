'use strict'

const dispatch = require('../reducers/dispatch')
const { DUMP_MODAL_STATE, FEED_MANAGE_FILE } = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')

ipcMain.on(DUMP_MODAL_STATE, () => dispatch({ type: DUMP_MODAL_STATE }))

ipcMain.on(FEED_MANAGE_FILE, (event, load) => dispatch({ type: FEED_MANAGE_FILE, load }))