'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

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