'use strict'

const { colors, fonts } = require('../../../lib/styleUtils')
const { css } = require('../../../lib/cssTool/css')

module.exports = {
  colors,
  fonts,

  container: css`
    :host {
      align-items: center;
      display: flex;
      font-family: ${fonts.light};
      font-size: 16px;
      padding-left: 10px;
      height: 35px;
    }
  `
}