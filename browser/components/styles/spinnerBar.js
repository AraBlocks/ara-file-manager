'use strict'

const { colors } = require('styleUtils')
const { css } = require('css')

module.exports = {
  spinnerBars: css`
    :host {
      font-size: 10px;
      height: 70px;
    }

    :host > div {
      animation: sk-stretchdelay 1.2s infinite ease-in-out;
      background-color: var(--ara-blue);
      display: inline-block;
      height: 100%;
      margin-right: 3px;
      width: 6px;
    }

    :host .rect2 {
      animation-delay: -1.1s;
    }

    :host .rect3 {
      animation-delay: -1.0s;
    }

    :host .rect4 {
      animation-delay: -0.9s;
    }

    :host .rect5 {
      animation-delay: -0.8s;
    }
  `,

}