'use strict'

const Checkbox = require('../../browser/components/checkbox')

describe('Checkbox Component', () => {
	it('Should update state', () => {
		const initialState = false
		const checkbox = new Checkbox({
			parentState: {
				checked: initialState
			}
		})

		const testComponentNode = document.getElementById('test components')
		testComponentNode.appendChild(checkbox.render())
		checkbox.onclick()
		expect(checkbox.state.checked !== initialState)
		testComponentNode.removeChild(testComponentNode.firstChild)
	})
})


