const Checkbox = require('../../browser/components/checkbox')
const DomElementManager = require('../domElementManager')

describe('Checkbox Component', () => {
	it('Should update state', () => {
		const initialState = false
		const checkbox = new Checkbox({
			parentState: {
				checked: initialState
			}
		})

		DomElementManager.mountElement(checkbox.render())
		checkbox.onclick()
		expect(checkbox.state.checked).to.not.equal(initialState)
		DomElementManager.removeAllElements()
	})
})
