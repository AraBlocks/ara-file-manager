'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afsManager')
const { AWAITING_DOWNLOAD, DOWNLOADED, PUBLISHING } = require('../../../lib/constants/stateManagement')
const dcdnFarm = require('ara-network-node-dcdn-farm')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const fs = require('fs')
const araFilesystem = require('ara-filesystem')
const path = require('path')
const windowManager = require('electron-window-manager')
const { account, broadcastState } = windowManager.sharedData.fetch('store')


async function broadcast({ did , price = 0}) {
	debug('Broadcasting for %s', did)
	try {
		dcdnFarm.start({
			did,
			download: false,
			upload: true,
			userID: account.userAid.slice(8),
			price,
		})
	} catch (err) {
		debug('Error broadcasting %O', err)
	}
	debug('donezo')
}

async function stopBroadcast() {
	if (!broadcastState.isBroadcasting) {
		debug('Currently not broadcasting')
		return
	}
	debug('Stopping DCDN broadcast')
	try {
		await dcdnFarm.stop()
	} catch(e) {
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
	} catch(e) {
		debug(e)
	}
}

async function download({
	errorHandler,
	did,
	handler,
	maxWorkers = 1,
	price = 1
}) {
	debug('Downloading through DCDN: %s', did)
	try {
		await dcdnFarm.start({
			did: did,
			download: true,
			upload: false,
			userID: account.userAid.slice(8),
			price,
			maxWorkers
		})
		const dcdn = await dcdnFarm.getInstance()
		let totalBlocks = 0
		let prevPercent = 0
		dcdn.on('start', (did, total) => totalBlocks = total)
		dcdn.on('progress', (did, value) => {
			const perc = value/totalBlocks
			if (perc >= prevPercent + 0.1) {
				prevPercent = perc
				if (value/totalBlocks != 1) {
					handler({ downloadPercent: value/totalBlocks, aid: did })
				}
			}
		})
		dcdn.user.on('complete', () => {
			handler({ downloadPercent: 1, aid: did })
			renameAfsFiles(did, 'movie.mov')
		})
	} catch (err) {
		debug('Error downloading: %O', err)
		errorHandler()
	}
}

function unarchiveAFS({ did, path }) {
	debug('Unarchiving %o', { did, path })
	araFilesystem.unarchive({ did, path })
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
	fs.rename(afsFilePath, newPath, function(err) {
		if (err) {
			console.log('some error occurred when renaming afs files')
		}
	})
}

module.exports = {
	broadcast,
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