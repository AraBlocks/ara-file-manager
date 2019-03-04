const debug = require('debug')('afm:kernel:redux:actions:analytics')
const ua = require('universal-analytics')
const pify = require('pify')
const uuid = require('uuid/v4')
const { version } = require('../../../package.json')
const { getAppData } = require('./afmManager')
const { analytics, application } = require('k')
const isDev = require('electron-is-dev')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

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

  const session = ua(analytics.UA_ACCOUNT_CURRENT, deviceId)
  session.set(analytics.VERSION, version)
  session.firstSession = firstSession
  global.session = session
  return session
}

async function trackAppOpen() {
  const session = await getSession()
  return trackEvent(analytics.CATEGORY.APPLICATION, (session.firstSession) ? analytics.ACTION.FIRST_OPEN : analytics.ACTION.OPEN)
}

async function trackScreenView(screen) {
  debug('trackScreenView:', screen)
  if(!hasAnalyticsPermission()) { return }
  const session = await getSession()
  session.pageview(screen, analytics.APP_NAME, screen).send()
}

async function trackEvent(category, action, label, value) {
  if(!hasAnalyticsPermission()) { return }
  const session = await getSession()
  session.event({
    ec: category,
    ea: action,
    el: label,
    ev: value,
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