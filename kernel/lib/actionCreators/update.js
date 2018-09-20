'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:publish')
const { create, remove } = require('ara-filesystem')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
  afsManager,
  publish
} = require('../actions')
const {
  CHANGE_BROADCASTING_STATE,
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
  afsManager.stopBroadcast()
  dispatch({ type: CHANGE_BROADCASTING_STATE, load: false })
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

ipcMain.on(CONFIRM_UPDATE, async (event, load) => {
  debug('%s heard. Load: %o', CONFIRM_UPDATE, load)
  try {
    console.log('committing')
    publish.commit({ ...load, password: account.password })
      .then(async () => {
        windowManager.pingView({ view: 'filemanager', event: UPDATED })
        dispatch({ type: UPDATED, load: load.did })
        debug('Dispatch %s . Load: %s', UPDATED, load.did)
        afsManager.unarchiveAFS({ did: load.did, path: afsManager.makeAfsPath(load.did) })
        afsManager.broadcast({ did: load.did })
        dispatch({ type: CHANGE_BROADCASTING_STATE, load: true })
      })
      .catch(debug)

    dispatch({
      type: UPDATING,
      load: {
        aid: load.did,
        name: load.name,
        price: load.price
      }
    })

    windowManager.pingView({ view: 'filemanager', event: UPDATING })
    windowManager.get('manageFileView').close()
  } catch (err) {
    debug('Error: %O', err)
  }
})