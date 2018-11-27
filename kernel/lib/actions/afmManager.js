'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afmManager')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
const araUtil = require('ara-util')

function getAFMPath(userDID) {
	const afmDirectory = getAFMDirectory()
	const fileDirectory = path.resolve(afmDirectory, `${araUtil.getIdentifier(userDID)}.json`)
	return fileDirectory
}

function getAFMDirectory() {
	const afmDirectory = path.resolve(userHome, '.afm')
	fs.existsSync(afmDirectory) || fs.mkdirSync(afmDirectory)
	return afmDirectory
}

function getPublishedItems(userDID) {
	const fileDirectory = getAFMPath(userDID)
	const userData = parseJSON(fileDirectory)
	return userData.published ? userData.published : []
}

function removedPublishedItem(contentDID, userDID) {
	try {
		const afmFilePath = getAFMPath(userDID)
		const userData = parseJSON(afmFilePath)
		userData.published = userData.published.filter(did => did !== contentDID)
		fs.writeFileSync(afmFilePath, JSON.stringify(userData))
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
		const fileDirectory = getAFMPath(userDID)
		const data = parseJSON(fileDirectory)
		data.published == null
			? data.published = [contentDID]
			: data.published.push(contentDID)
		fs.writeFileSync(fileDirectory, JSON.stringify(data))
		return
	} catch (err) {
		debug('Error saving published item: %o', err)
	}
}

module.exports = {
	cacheUserDid,
	getAFMPath,
	getCachedUserDid,
	getPublishedItems,
	savePublishedItem,
	removedPublishedItem
}