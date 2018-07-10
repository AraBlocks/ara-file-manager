'use strict'

const { colors, fonts } = require('../../../../lib/styleUtils')
const { css } = require('css')

module.exports = {
  container: css`
    :host {
      font-family: ${fonts.boldSpecial};
    }

    :host > div {
      font-size: 18px;
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