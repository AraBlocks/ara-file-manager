'use strict'

const UtilityButton = require('../../browser/components/utilityButton')

describe('UtilityButton Component', () => {
	it('Should Update State', () => {
		const updatedState = {
			children: 'New Children'
		}

		const utilityButton = new UtilityButton({
			children: 'children'
		})

		expect(utilityButton.state.children !== updatedState.children)
		utilityButton.render(updatedState)
		expect(utilityButton.state.children === updatedState.children)
	})
})