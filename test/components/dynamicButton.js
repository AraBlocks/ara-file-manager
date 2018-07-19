'use strict'

const DynamicButton = require('../../browser/components/dynamicButton')

describe('DynamicButton Component', () => {
  it('Should update state', () => {
    const updatedState = {
      children: 'Updated',
      onclick: () => {},
      cssClass: {},
      onmouseout: () => {},
      onmouseover: () => {},
      type: 'New Type'
    }
    const dynamicButton = new DynamicButton({})
    const initialState = dynamicButton.state

    dynamicButton.render(updatedState)

    Object.entries(initialState).forEach(([attr]) => {
      expect(initialState[attr]).not.to.equal(updatedState[attr])
    })
  })
})