'use strict'

const { create, remove } = require('ara-filesystem')
const debug = require('debug')('acm:kernel:lib:actionCreators:publish')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
  afsManager,
  araContractsManager,
  publish
} = require('../actions')
const {
  CONFIRM_UPDATE,
  ESTIMATION,
  ESTIMATING_COST,
  FEED_MODAL,
  UPDATE,
  UPDATED,
  UPDATING,
} = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

ipcMain.on(UPDATE, async (event, load) => {
  debug('%s heard. Load: %O', UPDATE, load)
  try {
		const { afs } = await create({ did: load.fileAid })
		const result = await afs.readdir(afs.HOME)
		await afs.close()
		const instance = await remove({ did: load.fileAid, password: account.password, paths: result })
		await instance.close()

    event.sender.send(ESTIMATING_COST)
    const estimate = await publish.addCreateEstimate(load)
    debug('Dispatching %s . Load: %O', FEED_MODAL, estimate)
    dispatch({ type: FEED_MODAL, load: estimate })

    event.sender.send(ESTIMATION)
  } catch(err) {
    debug('Error: %O', err)
  }
})
