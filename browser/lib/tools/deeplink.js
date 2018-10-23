'use strict'

const {	clipboard } = require('electron')

function copyDeeplink(aid, fileName) {
	const link = getDeeplink(aid, fileName)
	clipboard.writeText(link)
}

function getDeeplink(aid, fileName) {
	const encodedName = encodeURIComponent(fileName)
	return `lstr://download/${aid}/${encodedName}`
}

module.exports = {
  copyDeeplink,
  getDeeplink
}