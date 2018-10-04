'use strict'

const debug = require('debug')('acm:kernel:lib:actions:acmManager')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')

function getACMPath(userDID) {
	const acmDirectory = path.resolve(userHome, '.acm')
	fs.existsSync(acmDirectory) || fs.mkdirSync(acmDirectory)
	const fileDirectory = path.resolve(userHome, '.acm', userDID.slice(-64))
	return fileDirectory
}

function getPublishedItems(userDID) {
	const fileDirectory = getACMPath(userDID)
	let data
	try {
		data = fs.readFileSync(fileDirectory)
	} catch (err) {
		debug('No published items found for %s', userDID)
		return []
	}
	const itemList = data.toString('utf8').slice(-1).split('\n')
	debug('Retrieved %s published items', itemList.length)
	return itemList
}

function savePublishedItem(contentDID, userDID) {
	try {
		debug('Saving published item %s', contentDID)
		const fileDirectory = getACMPath(userDID)
		fs.appendFileSync(fileDirectory, `${contentDID}\n`)
		return
	} catch (err) {
		debug('Err: %o', err)
	}
}

async function removedPublishedItem(contentDID, userDID) {
	const items = await getPublishedItems(contentDID, userDID)
	const clean = items.filter(did => did !== contentDID)

	const fileDirectory = getACMPath()
	fs.unlinkSync(fileDirectory)
	if (clean.length) {
		clean.forEach(did => fs.appendFileSync(fileDirectory, `${did}\n`))
	}

	return clean
}

module.exports = {
	getACMPath,
	getPublishedItems,
	savePublishedItem,
	removedPublishedItem
}