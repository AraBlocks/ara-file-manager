'use strict'

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
      min-height: 85px;
      min-width: 220px;
    }
  `,

  publishedStatsHolder: css`
    :host {
      width: 50%;
    }
  `
}