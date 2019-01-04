'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  header: css`
    :host {
      background-color: white;
      font-family: ${fonts.black};
      font-size: 16px;
      height: 30px;
      position: sticky;
      pointer-events: none;
      top: 0px;
      z-index: 99;
    }
  `,

  separator: css`
    :host {
      background-color: ${colors.araGrey};
      height: 1px;
      margin: 13px 0 18px 0;
      width: 100%;
    }
  `
}