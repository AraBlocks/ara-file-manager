const debug = require('debug')('ara:fm:kernel:daemons:afm')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
const { app } = require('electron')
const araUtil = require('ara-util')
const toilet = require('toiletdb')
const pify = require('pify')
const { application } = require('k')
const { version } = require('../../package.json')
const rimraf = require('rimraf')

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

function cleanOutdatedData() {
	const filePath = path.resolve(getAFMDirectory(), 'store.json')
	const storeData = parseJSON(filePath)
	const compatible = storeData.version === version
	if (compatible) {
		debug('Version is compatible')
		return
	}
	const afmDirectory = path.resolve(userHome, '.ara', 'afm')
	const dcdnDirectory = path.resolve(userHome, '.ara', 'dcdn')
	fs.existsSync(afmDirectory) && rimraf(afmDirectory, () => {
		debug('remove afm')
		storeData.version = version
		const storePath = path.resolve(getAFMDirectory(), 'store.json')
		fs.writeFileSync(storePath, JSON.stringify(storeData))
	})
	fs.existsSync(dcdnDirectory) && rimraf(dcdnDirectory, () => { debug('remove dcdn')})
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
		await pify(appData.write)(application.CACHED_USER_DID, did)
	} catch(e) {
		debug(err)
	}
}

async function getCachedUserDid() {
	let did
	try {
		const appData = await getAppData()
		did = await pify(appData.read)(application.CACHED_USER_DID)
		return did || ''
	} catch(e) {
		debug(err)
		return ''
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
	cacheUserDid,
	getAFMPath,
	getAnalyticsPermission,
	getCachedUserDid,
	getAppData,
	getUserData,
	saveUserData,
	toggleAnalyticsPermission,
	cleanOutdatedData
}
