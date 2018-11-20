'use strict'

const { css } = require('css')
const { buttonSelector, colorSelector, fonts } = require('styleUtils')

module.exports = {
  buttonSelector,

  araIDHolder: css`
    :host {
      align-items: center;
      background-color: aliceBlue;
      border: 1px solid #97c7f0;
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      font-size: 9.5px;
      font-weight: bold;
      height: 3em;
      justify-content: center;
      margin-top: 20px;
      margin-bottom: 10px;
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

  containerCenter: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      justify-content: space-around;
      height: 95%;
      width: 100%;
    }

    :host > b {
      font-family: ${fonts.semibold};
    }
  `,

  containerLeft: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      font-size: 12px;
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
      color: ${colorSelector('orange')};
      left: 43%;
      opacity: 0;
      position: absolute;
      z-index: -1;
    }
  `,

  fileName: css`
    :host {
      font-family: ${fonts.black};
      font-size: 22px;
      padding: 2px 0px;
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
      margin-bottom: 4px;
    }

    :host b {
      background-color: aliceBlue;
      border: 1px solid #97c7f0;
      border-radius: 3px;
      padding: 3px;
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

    :host > b {
      font-family: ${fonts.semibold}
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
      font-family: ${fonts.black};
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