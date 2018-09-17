'use strict'

const ProgressRing = require('../../browser/components/progressRing')

describe('ProgressRing', () => {
  let progressRing
  beforeEach(() => {
    progressRing = new ProgressRing
  })

  it('should render "✖" when status 0', () => {
    const node = progressRing.render({ status: 0 })
    expect(node.children[0].children[2].innerHTML).to.equal('✖')
  })

  it('should render "⬇" when status 1', () => {
    const node = progressRing.render({ status: 1 })
    expect(node.children[0].children[2].innerHTML).to.equal('⬇')
  })

  it('should render "⬆" when status 2', () => {
    const node = progressRing.render({ status: 2 })
    expect(node.children[0].children[2].innerHTML).to.equal('⬆')
  })
})