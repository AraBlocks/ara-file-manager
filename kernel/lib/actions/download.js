'use strict'

const afsManager = require('./afsManager')

module.exports = ({did, handler}) => {
	afsManager.download({did, handler})
}

