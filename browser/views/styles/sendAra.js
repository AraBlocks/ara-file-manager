'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  colors,
  fonts,

  header: css`
    :host {
      display: flex;
      font-family: ${fonts.black};
      font-size: 20px;
      width: 90%;
    }
  `,

  description: css`
    :host {
      font-family: ${fonts.light};
      font-size: 12px;
      width: 90%;
    }

    :host > b {
      font-family: ${fonts.semibold}
    }
  `,

  divider: css`
    :host {
      background-color: ${colors.araGrey};
      height: 1px;
      width: 90%;
    }
  `,

  sendAraForm: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 160px;
      justify-content: space-between;
      padding-bottom: 15px;
      width: 90%;
    }
  `
}