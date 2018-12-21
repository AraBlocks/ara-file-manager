'use strict'

const debug = require('debug')('acm:kernel:lib:actions:util')
const { stateManagement: k, networkKeys } = require('k')
const afs = require('ara-filesystem')
const araContractsManager = require('./araContractsManager')
const araUtil = require('ara-util')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const path = require('path')
const fs = require('fs')
const createContext = require('ara-context')
const request = require('request-promise')


//TODO: figure out why reading metadata causes error for uncommitted afs
async function descriptorGenerator(did, opts = {}) {
	try {
		did = araUtil.getIdentifier(did)
		const AFSPath = await makeAfsPath(did)
		const AFSExists = fs.existsSync(AFSPath)
		const meta = AFSExists ? await readFileMetadata(did) : null
		const { downloadPercent, status } = await getAfsDownloadStatus(did, opts.shouldBroadcast)

		const descriptor = {
			allocatedRewards: 0,
			did,
			downloadPercent,
			datePublished: meta ? meta.timestamp : null,
			earnings: 0,
			name: meta ? meta.title : null,
			owner: false,
			path: AFSPath,
			peers: 0,
			price: Number(await araContractsManager.getAFSPrice({ did })),
			redeeming: false,
			shouldBroadcast: false,
			size: meta ? meta.size : 0,
			status
		}
		return Object.assign(descriptor, opts)
	} catch (err) {
		debug('descriptorGenerator Error:, %o', err)
	}
}

async function getAfsDownloadStatus(did, shouldBroadcast) {
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
  } catch(err) {
    debug('Error getting download status %o', err)
	}

	await newAfs.close()
  return { downloadPercent, status }
}

async function getNetwork() {
	const ctx = createContext()
	await ctx.ready()
	const { web3 } = ctx

	const networkType = await web3.eth.net.getNetworkType()

	ctx.close()
	return networkType
}

function makeAfsPath(did) {
	return path.join(createAFSKeyPath(did), 'home', 'content')
}

async function readFileMetadata(did) {
	let fileInfo = {}
	try {
		const data = await afs.metadata.readFile({ did })
		fileInfo = JSON.parse(data.fileInfo)
	} catch (err) {
		debug('No metadata for %s', did)
	}
	return fileInfo
}

async function requestAraFaucet(userDID) {
	return await request.post({
		method: 'POST',
		uri: networkKeys.FAUCET_URI,
		body: { to: userDID },
		json: true
	})
}

async function requestEthFaucet(ethAddress) {
	return await request(`https://faucet.ropsten.be/donate/${ethAddress}`)
}

async function writeFileMetaData({
	did,
	size = 0,
	title = '',
	userDID = '',
	password
}) {
	try {
		const fileData = {
			author: userDID,
			size,
			title,
			timestamp: new Date
		}
		const fileDataString = JSON.stringify(fileData)
		debug('Adding file metadata for %s', did)
		await afs.metadata.writeKey({ did, key: 'fileInfo', value: fileDataString, password })
	} catch (e) {
		debug(e)
	}
}

module.exports = {
	descriptorGenerator,
	getNetwork,
	makeAfsPath,
	readFileMetadata,
	requestAraFaucet,
	requestEthFaucet,
	writeFileMetaData
}