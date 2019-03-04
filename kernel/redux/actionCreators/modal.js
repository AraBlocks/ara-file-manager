const dispatch = require('../reducers/dispatch')
const { events } = require('k')
const { ipcMain } = require('electron')
const analytics = require('../actions/analytics')

ipcMain.on(events.DUMP_MODAL_STATE, () => dispatch({ type: DUMP_MODAL_STATE }))

ipcMain.on(events.PAGE_VIEW, (event, load) => {
  analytics.trackScreenView(load.view)
})