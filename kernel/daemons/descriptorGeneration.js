const debug = require('debug')('ara:fm:kernel:daemons:descriptorGeneration')

const { events } = require('k')
const araUtil = require('ara-util')
const fs = require('fs')

const act = require('./act')
const afs = require('./afs')
const rewardsDCDN = require('./rewardsDCDN')
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
		status: events.AWAITING_STATUS,
		shouldBroadcast: rewardsDCDN.getBroadcastingState({ did, DCDNStore }),
	})
}

async function makeDescriptor(did, opts = {}) {
	try {
		did = araUtil.getIdentifier(did)
		const AFSPath = await makeAfsPath(did)
		const AFSExists = fs.existsSync(AFSPath)
		const meta = AFSExists ? await readFileMetadata(did) : {}
		const { downloadPercent, status } = await afs.getAfsDownloadStatus(did, opts.shouldBroadcast)

		return Object.assign(new _Descriptor, {
			did,
			downloadPercent,
			datePublished: meta.timestamp,
			name: meta.title,
			path: AFSPath,
			price: Number(await act.getAFSPrice({ did, showDebug: false })),
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