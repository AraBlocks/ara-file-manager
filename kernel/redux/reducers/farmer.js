'use strict'

const { LOGIN } = require('../../../lib/constants/stateManagement')

module.exports = (state, { load = null, type }) => {
	switch (type) {
		case LOGIN:
			state.farm = load.farmer
			break
		default:
			return state
	}
	return state
}