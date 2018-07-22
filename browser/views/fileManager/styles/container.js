'use strict'

const { css } = require('css')

module.exports = {
  container: css`
    :host {
      padding-top: 10px;
      display: flex;
      justify-content: center;
    }

    :host > div {
      width: 95%;
    }
  `,

  sectionContainer: css`
    :host {
      height: 525px;
      overflow-y: scroll;
    }
  `
}