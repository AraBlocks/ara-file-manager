'use strict'

const FileSelector = require('../../browser/components/fileSelector')

describe('FileSelector Component', () => {
	it('Should Update State', () => {
		const updatedState = { filePath: 'newFilePath' }
		const fileSelector = new FileSelector({})

		const initialState = fileSelector.state.filePath
		fileSelector.render(updatedState)
		expect(fileSelector.state.filePath !== initialState)
	})
})