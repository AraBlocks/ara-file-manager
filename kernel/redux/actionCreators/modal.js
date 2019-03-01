const dispatch = require('../reducers/dispatch')
const { DUMP_MODAL_STATE, PAGE_VIEW } = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const analytics = require('../actions/analytics')

ipcMain.on(DUMP_MODAL_STATE, () => dispatch({ type: DUMP_MODAL_STATE }))

ipcMain.on(PAGE_VIEW, (event, load) => {
  analytics.trackScreenView(load.view)
})