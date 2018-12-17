'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afmManager')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
const { app } = require('electron')
const araUtil = require('ara-util')
const toilet = require('toiletdb')
const pify = require('pify')
const { application } = require('../../../lib/constants/index')

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

function removedPublishedItem(contentDID, userDID) {
	try {
		const userData = getUserData(userDID)
		userData.published = userData.published.filter(did => did !== contentDID)
		saveUserData({ userDID, userData })
	} catch(err) {
		debug('Error removing published item %o', err)
	}
}

function cacheUserDid(did) {
	try {
		const filePath = path.resolve(getAFMDirectory(), 'store.json')
		const cachedData = parseJSON(filePath)
		cachedData.cachedUserDid = did
		fs.writeFileSync(filePath, JSON.stringify(cachedData))
	} catch(err) {
		debug(err)
	}
}

function getCachedUserDid() {
	const filePath = path.resolve(getAFMDirectory(), 'store.json')
	const cachedData = parseJSON(filePath)
	return cachedData.cachedUserDid ? cachedData.cachedUserDid : ''
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

function savePublishedItem(contentDID, userDID) {
	try {
		debug('Saving published item %s', contentDID)
		const userData = getUserData(userDID)
		userData.published == null
			? userData.published = [contentDID]
			: userData.published.push(contentDID)
		saveUserData({ userDID, userData })
		return
	} catch (err) {
		debug('Error saving published item: %o', err)
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
	getCachedUserDid,
	getPublishedItems,
	getAppData,
	getUserData,
	savePublishedItem,
	saveUserData,
	removedPublishedItem
}