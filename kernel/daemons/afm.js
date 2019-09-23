const debug = require('debug')('ara:fm:kernel:daemons:afmManager')

const { app } = require('electron')
const { application } = require('k')
const araUtil = require('ara-util')
const fs = require('fs')
const path = require('path')
const pify = require('pify')
const rimraf = require('rimraf')
const toilet = require('toiletdb')
const userHome = require('user-home')

const { version } = require('../../package.json')

async function getAppData() {
  if (global.appData) return global.appData
  const appData = toilet(path.resolve(app.getPath('userData'), application.APP_DATA))
  await pify(appData.open)()
  global.appData = appData

  return appData
}

function getAFMPath(userDID) {
  const afmDirectory = getAFMDirectory()
  const fileDirectory = path.resolve(afmDirectory, `${araUtil.getIdentifier(userDID)}.json`)
  return fileDirectory
}

function getAFMDirectory() {
  const afmDirectory = path.resolve(userHome, '.ara', 'afm')
  fs.existsSync(afmDirectory) || fs.mkdirSync(afmDirectory)
  return afmDirectory
}

function getUserData(userDID) {
  const filePath = getAFMPath(userDID)
  return parseJSON(filePath)
}

//TODO: use Registry contract to return ProxyDeployed events instead of writing to disk
function getPublishedItems(userDID) {
  const userData = getUserData(userDID)
  return userData.published ? userData.published : []
}

async function cacheUserDid(did) {
  try {
    const appData = await getAppData()
    const dids = await pify(appData.read)(application.CACHED_USER_DIDS)
    if (typeof dids === 'object') {
      if (!Object.keys(dids).includes(did)) {
        await pify(appData.write)(application.CACHED_USER_DIDS, Object.assign(dids, { [did]: did.slice(0, 8), last: did }))
      } else {
        await pify(appData.write)(application.CACHED_USER_DIDS, Object.assign(dids, { last: did }))
      }
    } else {
      await pify(appData.write)(application.CACHED_USER_DIDS, { [did]: did.slice(0, 8), last: did })
    }
  } catch(err) {
    debug(err)
  }
}

async function getCachedUserDids() {
  let did
  try {
    const appData = await getAppData()
    did = await pify(appData.read)(application.CACHED_USER_DIDS)
    if (typeof did === 'string') {
      did = { [did]: did }
    }
    return did || { }
  } catch(err) {
    debug(err)
    return ''
  }
}

async function updateAccountName(did, name) {
  try {
    const appData = await getAppData()
    const dids = await pify(appData.read)(application.CACHED_USER_DIDS)
    await pify(appData.write)(application.CACHED_USER_DIDS, Object.assign(dids, { [did]: name }))
  } catch(err) {
    debug(err)
  }
}

function getAnalyticsPermission(userDID) {
  const userData = getUserData(userDID)
  if (userData.analyticsPermission == null) {
    userData.analyticsPermission = true
    saveUserData({ userDID, userData })
  }
  return userData.analyticsPermission
}

function toggleAnalyticsPermission(userDID) {
  const userData = getUserData(userDID)
  userData.analyticsPermission = !userData.analyticsPermission
  saveUserData({ userDID, userData })
  return userData.analyticsPermission
}

function parseJSON(path) {
  try {
    const data = fs.readFileSync(path)
    const object = JSON.parse(data)
    return object
  } catch (err) {
    return {}
  }
}

function saveUserData( { userDID, userData }) {
  try {
    debug('Saving User Data in .afm')
    const fileDirectory = getAFMPath(userDID)
    fs.writeFileSync(fileDirectory, JSON.stringify(userData))
  } catch(err) {
    debug('Error saving user data: %o', err)
  }
}

module.exports = {
  getAFMPath,
  getAppData,
  getUserData,
  cacheUserDid,
  saveUserData,
  getCachedUserDids,
  updateAccountName,
  getAnalyticsPermission,
  toggleAnalyticsPermission
}
