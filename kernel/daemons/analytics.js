const debug = require('debug')('ara:fm:kernel:daemons:analytics')

const { analytics, application } = require('k')
const isDev = require('electron-is-dev')
const pify = require('pify')
const uuid = require('uuid/v4')
const ua = require('universal-analytics')
const windowManager = require('electron-window-manager')

const { getAppData } = require('./afm')
const { version } = require('../../package.json')

const store = windowManager.sharedData.fetch('store')
const {
  analytics: a,
  application
} = require('k')

async function getSession() {
  if (global.session) return global.session

  let firstSession = false
  const appData = await getAppData()
  let deviceId = await pify(appData.read)(application.DEVICE_ID)
  if (!deviceId) {
    firstSession = true
    deviceId = uuid()
    await pify(appData.write)(application.DEVICE_ID, deviceId)
  }

  const session = ua(a.UA_ACCOUNT_CURRENT, deviceId)
  session.set(a.VERSION, version)
  session.firstSession = firstSession
  global.session = session
  return session
}

async function trackAppOpen() {
  const session = await getSession()
  return trackEvent(a.CATEGORY.APPLICATION, (session.firstSession) ? a.ACTION.FIRST_OPEN : a.ACTION.OPEN)
}

async function trackScreenView(screen) {
  debug('trackScreenView:', screen)
  if(!hasAnalyticsPermission()) { return }
  const session = await getSession()
  session.pageview(screen, a.APP_NAME, screen).send()
}

async function trackDownloadFinish(label, value) {
  if(!hasAnalyticsPermission()) { return }
  return trackEvent(a.CATEGORY.DOWNLOAD, a.ACTION.FINISH_TIME, a.LABEL.AFS_CONTENT, value)
}

async function trackEvent(category, action, label, value) {
  if(!hasAnalyticsPermission()) { return }
  const session = await getSession()
  session.event({
    ec: category,
    ea: action,
    el: label,
    ev: value,
    av: version,
    an: a.APP_NAME
  }).send()
}

function hasAnalyticsPermission() {
  if (store == null) { return true }
  return store.account.analyticsPermission
}

async function trackError(err) {
  if(!hasAnalyticsPermission()) { return }
  const session = await getSession()
  const sanitizedError = sanitizeErrorMessage(err)
  session.exception(sanitizedError, () => {}).send()
}

function sanitizeErrorMessage(err) {
  let devReg
  let buildReg
  switch (process.platform) {
    case 'win32':
      devReg = new RegExp('.:\\\\.*?ara-file-manager\\\\', 'ig')
      buildReg = new RegExp('.:\\\\.*?resources\\\\app\\\\', 'ig')
      break
    default:
      devReg = new RegExp('\/.*?\/ara-file-manager\/', 'ig') // Mac
      buildReg = new RegExp('\/.*?Resources\/app\/', 'ig')
  //TODO: Linux ?
  }
  return isDev
      ? err.replace(devReg, '')
      : err.replace(buildReg, '')
}

module.exports = {
  trackAppOpen,
  trackEvent,
  trackError,
  trackScreenView
}