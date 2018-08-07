'use strict'

const afsManager = require('./afsManager')

module.exports = ({ did, handler, errorHandler }) => {
	afsManager.download({ did, handler, errorHandler })
}

