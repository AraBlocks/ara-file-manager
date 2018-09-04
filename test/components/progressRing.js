'use strict'

const { AWAITING_DOWNLOAD, DOWNLOADING, DOWNLOADED_PUBLISHED, } = require('../../lib/constants/stateManagement')
const ProgressRing = require('../../browser/components/progressRing')

describe('ProgressRing', () => {
  let progressRing
  beforeEach(() => {
    progressRing = new ProgressRing
  })

  it('should render "✖" when status AWAITING_DOWNLOAD', () => {
    const node = progressRing.render({ status: AWAITING_DOWNLOAD })
    expect(node.children[0].children[2].innerHTML).to.equal('✖')
  })

  it('should render "⬇" when status DOWNLOADING', () => {
    const node = progressRing.render({ status: 1 })
    expect(node.children[0].children[2].innerHTML).to.equal('⬇')
  })

  it('should render "⬆" when status DOWNLOADED_PUBLISHED', () => {
    const node = progressRing.render({ status: DOWNLOADED_PUBLISHED })
    expect(node.children[0].children[2].innerHTML).to.equal('⬆')
  })
})