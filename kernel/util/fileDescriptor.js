const debug = require('debug')('ara:fm:kernel:util:fileDescriptor')
const { events: k } = require('k')
const acmManager = require('../daemons/acm')
const afsManager = require('../daemons/fs')
const farmerManager = require('../daemons/dcdn')
const araUtil = require('ara-util')
const fs = require('fs')
const { makeAfsPath, readFileMetadata } = require('../daemons/utils')

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
			packageOpened: false,
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

function makeDummyDescriptor(did, DCDNStore, owner = false) {
	did = araUtil.getIdentifier(did)
	const AFSPath = makeAfsPath(did)
	return new _Descriptor({
		AFSExists: fs.existsSync(AFSPath),
		AFSPath,
		did,
		owner,
		status: k.AWAITING_STATUS,
		shouldBroadcast: farmerManager.getBroadcastingState({ did, DCDNStore }),
	})
}

async function makeDescriptor(did, opts = {}) {
	try {
		did = araUtil.getIdentifier(did)
		const AFSPath = await makeAfsPath(did)
		const AFSExists = fs.existsSync(AFSPath)
		const meta = AFSExists ? await readFileMetadata(did) : {}
		const { downloadPercent, status } = await afsManager.getAfsDownloadStatus(did, opts.shouldBroadcast)

		return Object.assign(new _Descriptor, {
			did,
			downloadPercent,
			datePublished: meta.timestamp,
			name: meta.title,
			path: AFSPath,
			price: Number(await acmManager.getAFSPrice({ did })),
			size: meta.size || 0,
			status
		}, opts)
	} catch (err) {
		debug('makeDescriptor Error:, %o', err)
	}
}

module.exports = {
	makeDescriptor,
	makeDummyDescriptor
}
