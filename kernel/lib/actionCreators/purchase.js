'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:purchase')
const dispatch = require('../reducers/dispatch')
const { getAFSPrice } = require('../actions/afsManager')
const {
  FEED_MODAL,
  PROMPT_PURCHASE,
  PURCHASE_INFO
} = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')

internalEmitter.on(PROMPT_PURCHASE, async (load) => {
  try {
    debug('%s heard. Load: %o', PROMPT_PURCHASE, load)
    const price = await getAFSPrice({ did: load.aid })
    dispatch({ type: FEED_MODAL, load: { price, ...load } })
    internalEmitter.emit(PURCHASE_INFO)
  } catch (err) {
    debug('Error: %O', err)
  }
})

ipcMain.on(MAKE_PURCHASE, (event, load) => {
})