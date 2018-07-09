'use strict'

const { colors, fonts } = require('../../../../lib/styleUtils')
const { css } = require('css')

module.exports = {
  container: css`
    :host {
      font-family: ${fonts.boldSpecial};
    }
  `,

  separator: css`
    :host {
      background-color: ${colors.araGrey};
      height: 1px;
      width: 100%;
    }
  `
}