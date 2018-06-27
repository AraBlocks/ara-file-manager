'use strict'

const { fonts } = require('../../lib/styles')
const { css } = require('../../lib/cssTool/css')

module.exports = {
  standard: css`
    :host {
      background-color: #fc2636;
      color: white;
      font-family: ${fonts.bold};
      font-size: 18px;
      height: 50px;
      width: 90%;
    }
  `,
}