'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afsManager')
const actionsUtil = require('./utils')
const fs = require('fs')
const araFilesystem = require('ara-filesystem')
const farmerManager = require('../actions/farmerManager')
const mirror = require('mirror-folder')
const path = require('path')
const windowManager = require('electron-window-manager')

async function exportFile({ did, exportPath, filePath }) {
	debug('Exporting file %s to %s', filePath, exportPath)
	try {
    const { afs } = await araFilesystem.create({ did })
    const fullPath = path.join(afs.HOME, filePath)
    const fileData = await afs.readFile(fullPath)
    afs.close()
    fs.writeFileSync(exportPath, fileData)
  } catch (err) {
		debug('Error exporting file %s to %s: %o', filePath, exportPath, err)
	}
}

async function exportFolder({ did, exportPath, folderPath }) {
  try {
    const { afs } = await araFilesystem.create({ did })
    const fullPath = path.join(afs.HOME, folderPath)
    debug({fullPath})
    const result = await afs.readdir(fullPath)
    if (result.length === 0) {
      throw new Error('Can only export a non-empty AFS Folders.')
    }

    const progress = mirror({
      name: fullPath,
      fs: afs
    }, { name: exportPath }, { keepExisting: true })
    await new Promise((accept, reject) => progress.once('end', accept).once('error', reject))
    await afs.close()
    debug('Successfully exported folder')
  } catch (err) {
    debug('Error exporting folder: %o', err)
  }
}

async function getFileList(did) {
	debug('Getting file list in AFS')
	try {
		const { afs } = await araFilesystem.create({ did })
		const result = await _getContentsInFolder(afs, afs.HOME)
		await afs.close()
		return result
	} catch (err) {
		debug('Error getting file list in afs: %o', err)
	}
}

// This function does not open/close afs.
async function _getContentsInFolder(afs, folderPath) {
  try {
    const result = []
    const contents = await afs.readdir(folderPath)
    for (let i = 0; i < contents.length; i ++) {
      const subPath = contents[i]
      const fullPath = path.join(folderPath, subPath)
      const fileStats = await afs.stat(fullPath)
      if (fileStats.isFile()) {
        if (subPath !== ".DS_Store") {
          result.push({
            isFile: true,
            subPath,
            size: fileStats.size
          })
        }
      } else {
        const items = await _getContentsInFolder(afs, fullPath)
        const itemList = {
          isFile: false,
          subPath,
          size: fileStats.size,
          items
        }
        result.push(itemList)
      }
    }
    return result
  } catch(e) {
    debug('Error getting contents: %o', err)
  }
}

async function surfaceAFS({ dids, published = false }) {
	const dcdnFarmStore = farmerManager.loadDcdnStore()
	return Promise.all(dids.map(did => actionsUtil.descriptorGenerator(did, {
		shouldBroadcast: farmerManager.getBroadcastingState({ did, dcdnFarmStore }),
		owner: published
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
  exportFile,
  exportFolder,
	getFileList,
	surfaceAFS,
	unarchiveAFS,
}