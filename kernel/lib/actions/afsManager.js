'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afsManager')
const actionsUtil = require('./utils')
const fs = require('fs')
const araFilesystem = require('ara-filesystem')
const path = require('path')
const farmerManager = require('../actions/farmerManager')

async function afsPathIsFile({ did, path }) {
	try {
    const { afs } = await araFilesystem.create({ did })
    const res = await afs.stat(path)
    afs.close()
    return res.isFile()
  } catch (err) {
		debug('Error getting file size for %s', did)
	}
}

async function exportFile({ did, exportPath, filePath }) {
	debug('Exporting file %s to %s', filePath, exportPath)
	try {
    const { afs } = await araFilesystem.create({ did })
    const fileData = await afs.readFile(filePath)
    afs.close()
    fs.writeFileSync(exportPath, fileData)
  } catch (err) {
		debug('Error exporting file %s to %s', filePath, exportPath)
	}
}

async function getFileList(did) {
	debug('Getting file list in AFS')
	try {
		const { afs } = await araFilesystem.create({ did })
		const result = await afs.readdir(afs.HOME)
		await afs.close()
		return result
	} catch (err) {
		debug('Error getting file list in afs: %o', err)
	}
}

async function getFileSize(did, path) {
	debug('Getting file size in AFS')
	try {
    const { afs } = await araFilesystem.create({ did })
    const res = await afs.stat(path)
    afs.close()
    return res.size
  } catch (err) {
		debug('Error getting file size for %s', did)
	}
}


async function removeAllFiles({ did, password }) {
	try {
		const fileList = getFileList(did)
		const instance = await araFilesystem.remove({ did, password, paths: fileList })
		await instance.close()
	} catch (err) {
		debug('Error removing files: %o', err)
	}
}

function renameAfsFiles(aid, fileName) {
	const afsFolderPath = actionsUtil.makeAfsPath(aid)
	const afsFilePath = path.join(afsFolderPath, 'data')
	const newPath = path.join(afsFolderPath, fileName)
	fs.rename(afsFilePath, newPath, function (err) {
		if (err) {
			debug('some error occurred when renaming afs files')
		}
	})
}

async function surfaceAFS(items, dcdnFarmStore) {
	return Promise.all(items.map(item => actionsUtil.descriptorGenerator(item, {
		shouldBroadcast: farmerManager.getBroadcastingState({ did: item, dcdnFarmStore })
	})))
}

function unarchiveAFS({ did }) {
	debug('Unarchiving %s', did)
	try {
		araFilesystem.unarchive({ did, path: actionsUtil.makeAfsPath(did) })
	} catch (err) {
		debug('Error unarchiving: %o', err)
	}
}

module.exports = {
	afsPathIsFile,
	exportFile,
	getFileList,
	getFileSize,
	removeAllFiles,
	renameAfsFiles,
	surfaceAFS,
	unarchiveAFS,
}