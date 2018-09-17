'use strict'

const { AWAITING_DOWNLOAD, DOWNLOADING} = require('../../../../lib/constants/stateManagement')
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

  container(status) {
    let color
    switch (status) {
      case AWAITING_DOWNLOAD:
      case DOWNLOADING:
        color = colorSelector('grey')
        break
      default:
        color = colorSelector('black')
    }

    return css`
      :host {
        align-items: flex-end;
        display: flex;
        flex-direction: column;
        height: 75px;
        width: 100%;
        color: ${color};
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
      font-size: 16px;
    }
  `,

  stats: css`
    :host {
      display: flex;
      font-family: ${fonts.regular};
      font-size: 14px;
      justify-content: flex-end;
    }
  `
}