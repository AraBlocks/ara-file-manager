const testComponentId = 'test'
module.exports = {
	mountElement(element) {
		const testComponentDiv = document.createElement('div')
		testComponentDiv.id = testComponentId
		document.body.appendChild(testComponentDiv)
		testComponentDiv.appendChild(element)
	},
	removeAllElements() {
		document.body.removeChild(document.getElementById(testComponentId))
	}
}