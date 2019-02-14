const { events: k } = require('k')

module.exports = (state, { load = null, type }) => {
	switch (type) {
		case k.LOGIN:
		case k.REGISTERED:
			state.farm = load.farmer
			break
		default:
			return state
	}
	return state
}
