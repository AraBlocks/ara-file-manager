'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afsManager')
const actionsUtil = require('./utils')
const fs = require('fs')
const araFilesystem = require('ara-filesystem')
const path = require('path')

async function removeAllFiles({ did, password }) {
	try {
		const { afs } = await araFilesystem.create({ did })
		const result = await afs.readdir(afs.HOME)
		await afs.close()
		const instance = await araFilesystem.remove({ did, password, paths: result })
		await instance.close()
	} catch (err) {
		debug('Error removing files: %o', err)
	}
}

function unarchiveAFS({ did }) {
	debug('Unarchiving %s', did)
	try {
		araFilesystem.unarchive({ did, path: actionsUtil.makeAfsPath(did) })
	} catch (err) {
		debug('Error unarchiving: %o', err)
	}
}

async function surfaceAFS(items) {
	return Promise.all(items.map(item => actionsUtil.descriptorGenerator(item)))
}

function renameAfsFiles(aid, fileName) {
	const afsFolderPath = makeAfsPath(aid)
	const afsFilePath = path.join(afsFolderPath, 'data')
	const newPath = path.join(afsFolderPath, fileName)
	fs.rename(afsFilePath, newPath, function (err) {
		if (err) {
			debug('some error occurred when renaming afs files')
		}
	})
}

module.exports = {
	removeAllFiles,
	renameAfsFiles,
	surfaceAFS,
	unarchiveAFS,
}