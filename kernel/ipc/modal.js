const { events } = require('k')
const { ipcMain } = require('electron')

const { analytics } = require('../daemons')
const dispatch = require('../redux/reducers/dispatch')

ipcMain.on(events.DUMP_MODAL_STATE, () => dispatch({ type: DUMP_MODAL_STATE }))

ipcMain.on(events.PAGE_VIEW, (_, load) => {
  analytics.trackScreenView(load.view)
})