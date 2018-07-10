'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  buttonHolder: css`
    :host {
      width: 100%;
    }

    :host button {
      text-align: right;
      width: 100%;
    }
  `,

  container: css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      height: 75px;
      width: 100%;
    }
  `,

  divider: css`
    :host {
      margin: 0 8px;
    }
  `,

  earnings(status) {
    return css`
      :host {
        color: ${status === 2 ? 'black' : colors.araGrey};
        font-family: ${fonts.regular};
        font-size: 14px;
      }
    `
  },

  stats: css`
    :host {
      display: flex;
      justify-content: flex-end;
    }
  `,

  peers: css`
    :host {
      font-family: ${fonts.regular};
      font-size: 14px;
    }
  `
}