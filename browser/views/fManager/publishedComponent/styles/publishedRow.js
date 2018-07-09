'use strict'

const { colors, fonts } = require('../../../../lib/styleUtils')
const { css }  = require('../../../../lib/cssTool/css')

module.exports = {
  container: css`
    :host {
      align-items: baseline;
      display: flex;
      justify-content: space-between;
      width: 90%;
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