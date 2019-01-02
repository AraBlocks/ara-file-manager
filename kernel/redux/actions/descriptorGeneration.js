'use strict'

const debug = require('debug')('acm:kernel:lib:actions:descriptorGeneration')
const { stateManagement: k } = require('k')
const afs = require('ara-filesystem')
const araContractsManager = require('./araContractsManager')
const araUtil = require('ara-util')
const fs = require('fs')
const { makeAfsPath, readFileMetadata } = require('./utils')

class _Descriptor {
	constructor(opts = {}) {
		return Object.assign({
			allocatedRewards: 0,
			did: null,
			downloadPercent: 0,
			datePublished: null,
			earnings: 0,
			name: null,
			owner: false,
			path: null,
			peers: 0,
			price: 0,
			redeeming: false,
			shouldBroadcast: false,
			size: 0,
			status: null
		}, opts)
	}
}

function makeDummyDescriptor(did) {
	did = araUtil.getIdentifier(did)
	const AFSPath = makeAfsPath(did)
	const AFSExists = fs.existsSync(AFSPath)
	return new _Descriptor({ did, AFSPath, AFSExists })
}

async function makeDescriptor(did, opts = {}) {
	try {
		did = araUtil.getIdentifier(did)
		const AFSPath = await makeAfsPath(did)
		const AFSExists = fs.existsSync(AFSPath)
		const meta = AFSExists ? await readFileMetadata(did) : null
		const { downloadPercent, status } = await _getAfsDownloadStatus(did, opts.shouldBroadcast)

		return Object.assign(new _Descriptor, {
			did,
			downloadPercent,
			datePublished: meta ? meta.timestamp : null,
			name: meta ? meta.title : null,
			path: AFSPath,
			price: Number(await araContractsManager.getAFSPrice({ did })),
			size: meta ? meta.size : 0,
			status
		}, opts)
	} catch (err) {
		debug('makeDescriptor Error:, %o', err)
	}
}

async function _getAfsDownloadStatus(did, shouldBroadcast) {
	let downloadPercent = 0
	let status = k.AWAITING_DOWNLOAD
	let newAfs
	try {
		({ afs: newAfs } = await afs.create({ did }))
		const feed = newAfs.partitions.home.content
		if (feed && feed.length) {
			downloadPercent = feed.downloaded() / feed.length
		}
		if (downloadPercent === 1) {
			status = k.DOWNLOADED_PUBLISHED
		} else if (downloadPercent > 0) {
			status = k.DOWNLOADING
		} else if (downloadPercent === 0 && shouldBroadcast) {
			status = k.CONNECTING
		}
	} catch (err) {
		debug('Error getting download status %o', err)
	}

	await newAfs.close()
	return { downloadPercent, status }
}
module.exports = {
	makeDescriptor,
	makeDummyDescriptor
}