'use strict'

const { colors, fonts } = require('../../lib/styles')
const { css } = require('../../lib/cssTool/css')

module.exports = {
  colors,
  fonts,

  standard: css`
    :host {
      width: 35px;
      height: 35px;
      background-color: white;
    }
  `
}