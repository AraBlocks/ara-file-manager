'use strict'

const { css } = require('css')
const { buttonSelector, colorSelector, fonts } = require('styleUtils')

module.exports = {
  buttonSelector,

  araIDHolder: css`
    :host {
      background-color: #e6f9ff;
      font-size: 12px;
      margin-top: 20px;
      padding: 10px 2px;
      word-wrap: break-word;
    }
  `,

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

  containerLeft: css`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 95%;
    width: 90%;
  }

  :host > * {
    width: 95%;
  }
`,

  clipboard: css`
    :host span {
      animation-duration: 1000ms;
      color: red;
      left: 39%;
      opacity: 0;
      position: absolute;
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

  copyItemContainer: css`
    :host {
      padding-top: 8px;
      justify-content: center !important;
      display: flex !important;
      width: 100%;
    }

    :host > div {
      width: 35%;
    }
  `,

  logo: css`
    :host {
      align-content: center;
      display: flex;
      justify-content: center;
    }

    :host > img {
      height: 12px;
    }
  `,

  mnemonicContainer: css`
    :host {
      display: flex;
      flex-direction: column;
      width: 70%;
    }

    :host > div {
      display: flex;
      justify-content: space-between;
    }
  `
  ,

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

  title: css`
    :host {
      font-family: ${fonts.boldSpecial};
      font-size: 20px;
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