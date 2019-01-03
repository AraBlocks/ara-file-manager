'use strict'

const { stateManagement: k } = require('k')
const dispatch = require('../../reducers/dispatch')
const fs = require('fs')
const { acmManager, utils } = require('../../actions')
const windowManager = require('electron-window-manager')

function dispatchAndRefresh(type, load, index) {
  dispatch({ type, load })
  index % 3 === 0 && windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
}

async function getPublishedEarnings({ did }, index) {
  const earnings = await acmManager.getEarnings(did)
  dispatchAndRefresh(k.GOT_EARNING, { did, earnings }, index)
}

async function readMeta({ did }, index) {
  const AFSPath = utils.makeAfsPath(did)
  const AFSExists = fs.existsSync(AFSPath)
  if (AFSExists) {
    const meta = await utils.readFileMetadata(did)
    dispatchAndRefresh(k.GOT_META, { did, meta }, index)
  }
}

module.exports = {
  dispatchAndRefresh,
  getPublishedEarnings,
  readMeta
}