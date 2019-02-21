const { LOGIN, REGISTERED } = require('../../../lib/constants/stateManagement')

module.exports = (state, { load = null, type }) => {
	switch (type) {
		case LOGIN:
		case REGISTERED:
			state.farm = load.farmer
			break
		default:
			return state
	}
	return state
}