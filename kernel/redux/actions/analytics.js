const ua = require('universal-analytics');
const pify = require('pify')
const uuid = require('uuid/v4');
const { version } = require('../../../package.json')
const { getAppData } = require('./afmManager')
const { analytics, application } = require('../../../lib/constants/index')

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

    // TODO: state management for staging vs production
    const session = ua(analytics.UA_ACCOUNT_STAGING, deviceId)
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
    const session = await getSession()
    session.screenview(screen, analytics.APP_NAME).send()
}

async function trackEvent(category, action, label, value) {
    const session = await getSession()
    session.event({
        ec: category,
        ea: action,
        el: label,
        ev: value,
    }).send();
}

module.exports = {
    trackAppOpen,
    trackEvent,
    trackScreenView
}