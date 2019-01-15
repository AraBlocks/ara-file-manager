const { switchTrayLoginState, switchTrayPublishState } = require('./tray')
const { switchMenuLoginState, switchMenuPublishState } = require('./menu')

module.exports = {
	switchLoginState: (state) => {
		switchMenuLoginState(state)
		switchTrayLoginState(state)
	},
	switchPublishState: (pending) => {
		switchMenuPublishState(pending)
		switchTrayPublishState(pending)
	}
}