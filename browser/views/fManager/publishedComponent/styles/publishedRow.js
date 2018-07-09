'use strict'

const { colors, fonts } = require('../../../../lib/styleUtils')
const { css }  = require('css')

module.exports = {
  container: css`
    :host {
      align-items: baseline;
      display: flex;
      justify-content: space-between;
    }
  `,

  fileDescriptorHolder: css`
    :host {
      width: 50%;
    }
  `,

  publishedStatsHolder: css`
    :host {
      width: 50%;
    }
  `
}