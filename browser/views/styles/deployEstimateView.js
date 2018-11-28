
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
      justify-content: space-between;
      height: 75px;
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
      text-align: center;
      width: 100%;
      padding-top: 2.5%;
    }
  `,

  estimateHolder: css`
    :host {
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
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
      height: 14px;
      font-family: ${fonts.bold};
      font-size: 14px;
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