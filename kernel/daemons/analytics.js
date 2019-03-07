const debug = require('debug')('ara:fm:kernel:daemons:analytics')

const { analytics: a, application } = require('k')
const isDev = require('electron-is-dev')
const pify = require('pify')
const uuid = require('uuid/v4')
const ua = require('universal-analytics')
const windowManager = require('electron-window-manager')

const { getAppData } = require('./afm')
const { version } = require('../../package.json')

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

  const session = ua(a.UA_ACCOUNT_CURRENT, deviceId)
  session.set(a.VERSION, version)
  session.firstSession = firstSession
  global.session = session
  return session
}

const _makeTimeStamp = () => Date(Date.now())

async function trackAppOpen() {
  const session = await getSession()
  return trackEvent(a.CATEGORY.APPLICATION, (session.firstSession) ? a.ACTION.FIRST_OPEN : a.ACTION.OPEN)
}

async function trackScreenView(screen) {
  debug('trackScreenView:', screen)
  if (!hasAnalyticsPermission()) { return }
  const session = await getSession()
  session.pageview(screen, a.APP_NAME, screen).send()
}

function trackDownloadFinish() {
  debug('GA: trackDownloadFinish')
  trackEvent(a.CATEGORY.DOWNLOAD, a.ACTION.FINISH_TIME, a.LABEL.AFS_CONTENT, _makeTimeStamp())
}

function trackDownloadStart() {
  debug('GA: trackDownloadStart')
  trackEvent(a.CATEGORY.DOWNLOAD, a.ACTION.START_TIME, a.LABEL.AFS_CONTENT, _makeTimeStamp())
}

function trackPublishFinish() {
  debug('GA: trackPublishFinish')
  trackEvent(a.CATEGORY.PUBLISH, a.ACTION.FINISH_TIME, a.LABEL.AFS_CONTENT, _makeTimeStamp())
}

function trackPublishStart() {
  debug('GA: trackPublishStart')
  trackEvent(a.CATEGORY.PUBLISH, a.ACTION.START_TIME, a.LABEL.AFS_CONTENT, _makeTimeStamp())
}

function trackPurchaseFinish() {
  debug('GA: trackPurchaseFinsish')
  trackEvent(a.CATEGORY.PURCHASE, a.ACTION.FINISH_TIME, a.LABEL.AFS_CONTENT, _makeTimeStamp())
}

function trackPurchaseStart() {
  debug('GA: trackPurchaseStart')
  trackEvent(a.CATEGORY.PURCHASE, a.ACTION.START_TIME, a.LABEL.AFS_CONTENT, _makeTimeStamp())
}

async function trackEvent(category, action, label, value) {
  if (!hasAnalyticsPermission()) { return }
  const session = await getSession()
  session.event({
    ec: category,
    ea: action,
    el: label,
    ev: value,
    av: version,
    an: a.APP_NAME
  }, logErr).send()

  function logErr(err) {
    if (err) {
      debug('GA error for event: %o', {
        ec: category,
        ea: action,
        el: label,
        ev: value,
        av: version,
        an: a.APP_NAME
      })
      debug('%o', err)
    }
  }
}

function hasAnalyticsPermission() {
  if (store == null) { return true }
  return store.account.analyticsPermission
}

async function trackError(err) {
  if (!hasAnalyticsPermission()) { return }
  const session = await getSession()
  const sanitizedError = sanitizeErrorMessage(err)
  session.exception(sanitizedError, () => { }).send()
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
  trackDownloadFinish,
  trackDownloadStart,
  trackPublishFinish,
  trackPublishStart,
  trackPurchaseFinish,
  trackPurchaseStart,
  trackEvent,
  trackError,
  trackScreenView
}