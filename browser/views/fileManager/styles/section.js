'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  container: css`
    :host > div {
      font-size: 18px;
    }
  `,

  header: css`
    :host {
      font-family: ${fonts.boldSpecial};
    }
  `,

  separator: css`
    :host {
      background-color: ${colors.araGrey};
      height: 1px;
      margin: 13px 0;
      width: 100%;
    }
  `
}