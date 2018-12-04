'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afsManager')
const k = require('../../../lib/constants/stateManagement')
const actionsUtil = require('./utils')
const afmManager = require('./afmManager')
const fs = require('fs')
const araFilesystem = require('ara-filesystem')
const farmerManager = require('../actions/farmerManager')
const mirror = require('mirror-folder')
const path = require('path')
const { shell } = require('electron')

async function createDeployEstimateAfs(userDID, password) {
	try {
    const userData = afmManager.getUserData(userDID)
		if (userData.deployEstimateDid == null) {
			let { afs, afs: { did } } = await araFilesystem.create({ owner: userDID, password })
			await afs.close();
      userData.deployEstimateDid = did
			afmManager.saveUserData({ userDID, userData })
			return did
		}
		return userData.deployEstimateDid
	} catch(err) {
		debug('Error creating afs for deploy proxy estimate %o', err)
	}
}

async function exportFile({ did, exportPath, filePath, completeHandler }) {
	debug('Exporting file %s to %s', filePath, exportPath)
	try {
    const { afs } = await araFilesystem.create({ did })
    const fullPath = path.join(afs.HOME, filePath)
    const fileData = await afs.readFile(fullPath)
    afs.close()
    fs.writeFileSync(exportPath, fileData)
    shell.openItem(path.dirname(exportPath))
    completeHandler()
  } catch (err) {
		debug('Error exporting file %s to %s: %o', filePath, exportPath, err)
	}
}

async function exportFolder({ did, exportPath, folderPath, completeHandler }) {
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
    shell.openItem(exportPath)
    completeHandler()
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
		return result.fileList
	} catch (err) {
		debug('Error getting file list in afs: %o', err)
	}
}

// This function does not open/close afs.
async function _getContentsInFolder(afs, folderPath) {
  try {
    let totalSize = 0
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
        totalSize += fileStats.size
      } else {
        const items = await _getContentsInFolder(afs, fullPath)
        const itemList = {
          isFile: false,
          subPath,
          size: items.totalSize,
          items: items.fileList
        }
        result.push(itemList)
        totalSize += items.totalSize
      }
    }
    return { fileList: result, totalSize }
  } catch(err) {
    debug('Error getting contents: %o', err)
  }
}

async function getUpdateAvailableStatus(item) {
  let updateAvailable
  try {
    updateAvailable = await araFilesystem.isUpdateAvailable({ did: item.did })
  } catch (err) {
    debug('Error getting update available status')
  }
  return {
    ...item,
    status: updateAvailable && item.downloadPercent === 1 ? k.UPDATE_AVAILABLE : item.status
  }
}

async function surfaceAFS({ dids, DCDNStore, published = false }) {
	return Promise.all(dids.map(did => actionsUtil.descriptorGenerator(did, {
		shouldBroadcast: farmerManager.getBroadcastingState({ did: did.slice(-64), DCDNStore }),
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
  createDeployEstimateAfs,
  exportFile,
  exportFolder,
  getFileList,
  getUpdateAvailableStatus,
	surfaceAFS,
	unarchiveAFS,
}