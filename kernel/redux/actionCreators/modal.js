const dispatch = require('../reducers/dispatch')
const { stateManagement: k } = require('k')
const { ipcMain } = require('electron')
const analytics = require('../actions/analytics')

ipcMain.on(k.DUMP_MODAL_STATE, () => dispatch({ type: DUMP_MODAL_STATE }))

ipcMain.on(k.PAGE_VIEW, (event, load) => {
  analytics.trackScreenView(load.view)
})