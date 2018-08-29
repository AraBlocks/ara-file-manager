'use strict'

const { css } = require('css')
const { buttonSelector, colorSelector, fonts } = require('styleUtils')

module.exports = {
  buttonSelector,

  bigBold: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 50px;
    }
  `,

  bottomMargin: css`
    :host {
      margin-bottom: 10px;
    }
  `,

  container: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 95%;
      text-align: center;
      width: 90%;
    }

    :host > * {
      width: 95%;
    }
  `,

  fileName: css`
    :host {
      font-family: ${fonts.boldSpecial};
      font-size: 20px;
    }
  `,

  for: css`
    :host {
      font-size: 12px;
      margin: 12px 0;
    }
  `,

  horizontalContainer: css`
    :host {
      display: flex;
      justify-content: center;
    }
  `,

  link: css`
    :host {
      overflow: hidden;
      text-overflow: ellipsis;
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
    }
  `,

  preheader: css`
    :host {
      font-size: 12px;
      margin-bottom: 5px;
    }
  `,

  smallBold: css`
    :host {
      font-family: ${fonts.bold};
      font-size: 20px;
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

  smallPadding: css`
    :host {
      padding: 0px 2px;
    }
  `,

  spinnerHolder: css`
    :host {
      display: flex;
      justify-content: center;
      font-size: 4px;
    }
  `,

  verticalContainer: css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  `
}