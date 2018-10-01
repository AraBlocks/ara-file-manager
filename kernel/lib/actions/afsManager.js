'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afsManager')
const { AWAITING_DOWNLOAD, DOWNLOADED, PUBLISHING } = require('../../../lib/constants/stateManagement')
const farmDCDN = require('ara-network-node-dcdn-farm/src/farmDCDN')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const fs = require('fs')
const araFilesystem = require('ara-filesystem')
const path = require('path')
const windowManager = require('electron-window-manager')
const { account, broadcastState } = windowManager.sharedData.fetch('store')

function createFarmer({ did, password }) {
	debug('Creating Farmer')
	return new farmDCDN({ userID: did, password })
}

async function broadcast({ farmer, did, price = 1 }) {
	debug('Broadcasting for %s', did)
	try {
		farmer.join({
			did,
			download: false,
			upload: true,
			price
		})
	} catch (err) {
		debug('Error broadcasting %O', err)
	}
	debug('donezo')
}

async function stopBroadcast() {
	if (!broadcastState.isBroadcasting) {
		debug('Currently not broadcasting')
	}
	debug('Stopping DCDN broadcast')
	try {
		// await dcdn.stop()
	} catch (e) {
		debug(e)
	}
}

async function getAFSPrice({ did }) {
	debug('Getting price for %s', did)
	const result = await araFilesystem.getPrice({ did })
	return result
}

async function removeAllFiles({ did }) {
	try {
		const { afs } = await araFilesystem.create({ did })
		const result = await afs.readdir(afs.HOME)
		await afs.close()
		const instance = await araFilesystem.remove({ did, password: account.password, paths: result })
		await instance.close()
	} catch (e) {
		debug(e)
	}
}

async function download({
	farmer,
	errorHandler,
	did,
	handler,
	maxPeers = 1,
	price = 1
}) {
	debug('Downloading through DCDN: %s', did)
	try {
		await farmer.join({
			did,
			download: true,
			upload: false,
			price,
			maxPeers
		})

		let totalBlocks = 0
		let prevPercent = 0
		farmer.on('start', (did, total) => {
			debug('Starting download')
			totalBlocks = total
		})
		farmer.on('progress', (did, value) => {
			const perc = value / totalBlocks
			if (perc >= prevPercent + 0.1) {
				prevPercent = perc
				if (value / totalBlocks != 1) {
					handler({ downloadPercent: value / totalBlocks, aid: did })
				}
			}
		})
		farmer.on('complete', (did) => {
			debug('Download complete!')
			handler({ downloadPercent: 1, did })
			renameAfsFiles(did, 'movie.mov')
		})
		farmer.on('requestcomplete', (did) => {
			debug('Rewards allocated')
		})
	} catch (err) {
		debug('Error downloading: %O', err)
		errorHandler()
	}
}

function unarchiveAFS({ did, path }) {
	debug('Unarchiving %o', { did, path })
	try {
		araFilesystem.unarchive({ did, path })

	} catch (err) {
		debug(err)
	}
}

async function readFileMetadata(did) {
	try {
		const data = await araFilesystem.metadata.readFile({ did })
		debug('Read file metadata %O', data)
		return JSON.parse(data.fileInfo)
	} catch (err) {
		debug('No metadata for %s', did)
		return null
	}
}

async function writeFileMetaData({ did, size, title }) {
	try {
		const fileData = {
			author: account.username,
			size,
			title,
			timestamp: new Date,
		}
		const fileDataString = JSON.stringify(fileData)
		debug('Adding file metadata %s', fileDataString)
		araFilesystem.metadata.writeKey({ did, key: 'fileInfo', value: fileDataString })
	} catch (e) {
		debug(e)
	}
}

async function surfaceAFS(items) {
	return Promise.all(items.map(item => descriptorGenerator(item)))
}

function makeAfsPath(did) {
	return path.join(createAFSKeyPath(did), 'home', 'content')
}

async function descriptorGenerator(did, publishing = false) {
	try {
		did = did.slice(-64)
		const path = await makeAfsPath(did)
		const AFSExists = fs.existsSync(path)
		const meta = AFSExists ? await readFileMetadata(did) : null
		const descriptor = {
			did,
			downloadPercent: AFSExists || publishing ? 1 : 0,
			datePublished: meta ? meta.timestamp : null,
			earnings: 0,
			name: meta ? meta.title : 'Unnamed File',
			peers: 0,
			price: Number(await getAFSPrice({ did })),
			path,
			size: meta ? meta.size : 0,
			status: publishing ? PUBLISHING : AFSExists ? DOWNLOADED : AWAITING_DOWNLOAD
		}

		return descriptor
	} catch (err) {
		debug('descriptorGenerator Error:, %o', err)
	}
}

function renameAfsFiles(aid, fileName) {
	const afsFolderPath = makeAfsPath(aid)
	const afsFilePath = path.join(afsFolderPath, 'data')
	const newPath = path.join(afsFolderPath, fileName)
	fs.rename(afsFilePath, newPath, function (err) {
		if (err) {
			console.log('some error occurred when renaming afs files')
		}
	})
}

module.exports = {
	broadcast,
	createFarmer,
	descriptorGenerator,
	download,
	removeAllFiles,
	getAFSPrice,
	makeAfsPath,
	readFileMetadata,
	renameAfsFiles,
	surfaceAFS,
	stopBroadcast,
	unarchiveAFS,
	writeFileMetaData,
}