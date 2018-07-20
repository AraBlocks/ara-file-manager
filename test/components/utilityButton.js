'use strict'

const DomElementManager = require('../domElementManager')
const UtilityButton = require('../../browser/components/utilityButton')

describe('UtilityButton Component', () => {
	it('Should Update State', () => {
		const updatedState = {
			children: 'New Children'
		}

		const utilityButton = new UtilityButton({
			children: 'children'
		})

		DomElementManager.mountElement(utilityButton.render({}))
		expect(utilityButton.state.children).to.not.equal(updatedState.children)
		utilityButton.render(updatedState)
		expect(utilityButton.state.children).to.equal(updatedState.children)
		DomElementManager.removeAllElements()
	})
})