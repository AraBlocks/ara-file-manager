'use strict'

const { LOGIN_DEV } = require('../../../lib/constants/stateManagement')

module.exports = (state, { load = null, type }) => {
	switch (type) {
		case LOGIN_DEV:
			state.farm = load.farmer
			break
		default:
			return state
	}
	return state
}