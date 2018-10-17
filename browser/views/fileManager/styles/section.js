'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  header: css`
    :host {
      font-family: ${fonts.boldSpecial};
      font-size: 14px;
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