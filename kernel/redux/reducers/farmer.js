const { events } = require('k')

module.exports = (state, { load = null, type }) => {
	switch (type) {
		case events.LOGIN:
		case events.REGISTERED:
			state.farm = load.farmer
			break
		default:
			return state
	}
	return state
}