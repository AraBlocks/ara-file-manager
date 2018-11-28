
'use strict'

const { css } = require('css')
const { buttonSelector, colorSelector, fonts } = require('styleUtils')

module.exports = {
  buttonSelector,

  bottomMargin: css`
    :host {
      margin-bottom: 10px;
    }
  `,

  buttonHolder: css`
    :host {
      display: flex;
      flex-direction: column;
      height: 75px;
      justify-content: space-between;
      width: 90%;
    }
  `,

  container: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 216px;
      padding-top: 2.5%;
      text-align: center;
      width: 100%;
    }
  `,

  estimateHolder: css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px;
    }
  `,

  messageBold: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 25px;
    }
  `,

  postheader: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 14px;
      height: 14px;
    }
  `,

  smallMessage({
    color  = 'black',
  }) {
    return css`
      :host {
        color: ${colorSelector(color)};
        font-size: 12px;
        margin-bottom: 2px;
      }
      :host b {
        font-family: ${fonts.bold};
      }`
  },

  spinnerHolder: css`
    :host {
      display: flex;
      justify-content: center;
      font-size: 3px;
    }
  `,

  verticalContainer: css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  `,
}