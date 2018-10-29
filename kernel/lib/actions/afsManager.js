'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afsManager')
const actionsUtil = require('./utils')
const fs = require('fs')
const araFilesystem = require('ara-filesystem')
const farmerManager = require('../actions/farmerManager')
const path = require('path')

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
        result.push({
          isFile: true,
          subPath,
          size: fileStats.size
        })
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
    console.log(e)
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
	afsPathIsFile,
	exportFile,
	getFileList,
	getFileSize,
	surfaceAFS,
	unarchiveAFS,
}