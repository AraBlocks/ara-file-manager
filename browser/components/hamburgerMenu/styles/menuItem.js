'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  colors,
  fonts,

  container: css`
    :host {
      align-items: center;
      background-color: white;
      cursor: pointer;
      display: block;
      font-family: ${fonts.light};
      height: 2em;
      line-height: 2em;
      overflow: hidden;
      padding: 0 5px;
      text-align: center;
      text-overflow: ellipsis;
      vertical-align: middle;
    }

    :host:hover {
      background-color: #f2f2f2;
    }
  `
}