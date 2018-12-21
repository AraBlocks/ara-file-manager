const ua = require('universal-analytics');
const pify = require('pify')
const uuid = require('uuid/v4');
const { version } = require('../../../package.json')
const { getAppData } = require('./afmManager')
const { analytics, application } = require('../../../lib/constants/index')
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
    session.exception(err, () => {}).send()
}

module.exports = {
    trackAppOpen,
    trackEvent,
    trackError,
    trackScreenView
}