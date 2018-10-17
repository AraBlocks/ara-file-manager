'use strict'

const { colorSelector } = require('styleUtils')
const { css } = require('css')

module.exports = {
  colorSelector,

  holder: css`
    :host {
      background-color: ${colorSelector('grey')};
      height: 1px;
      width: 100%;
    }

    :host > div {
      height: 1px;
      transition: width 1000ms;
    }
  `,
}