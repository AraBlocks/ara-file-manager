'use strict'

const k = require('../../../../lib/constants/stateManagement')
const {
  colors,
  colorSelector,
  fonts
} = require('styleUtils')
const { css } = require('css')

module.exports = {
  colors,
  fonts,

  buttonHolder: css`
    :host {
      width: 100%;
    }

    :host button {
      font-size: 12px;
      height: 25px;
      text-align: right;
      width: 100%;
    }
  `,

  bolden: css`
    :host {
      font-family:${fonts.bold};
    }
  `,

  container(status) {
    const color = status === k.DOWNLOADED_PUBLISHED ? 'black' : 'grey'
    return css`
      :host {
        align-items: flex-end;
        display: flex;
        flex-direction: column;
        width: 100%;
        color: ${colorSelector(color)};
      }
    `
  },

  divider: css`
    :host {
      margin: 0 8px;
    }
  `,

  price: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 14px;
    }
  `,

  stats: css`
    :host {
      display: flex;
      font-family: ${fonts.regular};
      font-size: 12px;
      justify-content: flex-end;
    }
  `
}