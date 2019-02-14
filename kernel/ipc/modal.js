const dispatch = require('../state/dispatch')
const { events: k } = require('k')
const { ipcMain } = require('electron')

ipcMain.on(k.DUMP_MODAL_STATE, () => dispatch({ type: k.DUMP_MODAL_STATE }))
