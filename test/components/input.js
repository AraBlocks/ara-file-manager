'use strict'

const Input = require('../../browser/components/input')

describe('Input Component', () => {

  it('onchange should update value property in state', () => {
    const input = new Input({})
    const initialValue = input.state.value

    input.onchange({ target: { value: 'abc'}})

    expect(initialValue).not.to.equal(input.state.value)
    expect(input.state.value).to.equal('abc')
  })

  it('select should update selection property in state', () => {
    const input = new Input({
      embeddedButton: {
        option: 'selection',
        optionList: [
          'ARA',
          // 'USD'
				],
				field: 'currency'
      },
      parentState: { 'currency': 'ARA' }
    })
    const initialSelection = input.state.selection

    input.select({ target: { value: 'USD' } })

    expect(initialSelection).to.not.equal(input.state.selection)
    expect(input.state.selection).to.equal('USD')
  })
})
