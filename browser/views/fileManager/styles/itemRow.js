'use strict'

const { css }  = require('css')

module.exports = {
  container: css`
    :host {
      display: flex;
      height: 44px;
      justify-content: space-between;
    }
  `,

  fileDescriptorHolder: css`
    :host {
      min-width: 220px;
    }
  `,

  publishedStatsHolder: css`
    :host {
      width: 50%;
    }
  `
}