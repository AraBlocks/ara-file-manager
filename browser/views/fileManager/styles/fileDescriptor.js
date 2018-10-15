'use strict'

const { AWAITING_DOWNLOAD, DOWNLOADING } = require('../../../../lib/constants/stateManagement')
const { fonts, colorSelector } = require('styleUtils')
const { css } = require('css')

module.exports = {
  buttonHolder: css`
    :host {
      width: 100%;
    }

    :host button {
      font-size: 12px;
      height: 25px;
      text-align: left;
    }
  `,

  container: css`
    :host {
      display: flex;
      width: 100%;
    }
  `,

  exclamation: css`
    :host {
      color: red;
      font-size: 20px;
    }
  `,

  hamburgerHolder: css`
    :host {
      display: flex;
      align-items: center;
      width: 9%;
    }
  `,

  hamburger: css`
    :host {
      height: 8px;
      width: 40%;
    }
  `,

  name: css`
    :host {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,

  nameHolder: css`
    :host {
      display: flex;
      font-family: ${fonts.bold} !important;
      font-weight: bold;
      font-size: 17px;
      margin-bottom: 2px;
      width: 75%;
    }
  `,

  sizeHolder(status) {
    let color
    switch (status) {
      case AWAITING_DOWNLOAD:
        color = 'grey'
        break
      case DOWNLOADING:
        color = 'red'
        break
      default:
        color = 'blue'
    }
    return css`
      :host {
        color: ${colorSelector(color)};
        font-family: ${fonts.light};
        font-size: 12px;
      }
    `
  },

  summaryHolder: css`
    :host {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 88%;
    }
  `,


  tooltipHolder: css`
    :host {
      margin-left: 5px;
      margin-top: 3px;
    }
  `
}