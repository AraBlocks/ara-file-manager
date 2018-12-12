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

  container({
    justifyContent = 'space-between',
    height = 90
  }) {
    return css`
      :host {
        align-items: center;
        display: flex;
        flex-direction: column;
        height: ${height}%;
        justify-content: ${justifyContent};
        text-align: center;
        width: 90%;
      }

      :host > * {
        width: 95%;
      }
    `
  },

  containerCenter: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      height: 95%;
      justify-content: space-around;
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
      height: 95%;
      justify-content: space-around;
      width: 90%;
    }
  `,

  clipboard: css`
    :host {
      width: 100%;
    }

    :host span {
      animation-duration: 1000ms;
      color: ${colorSelector('orange')};
      left: 0;
      font-size: 18px;
      opacity: 0;
      position: absolute;
      width: 100%;
      text-align: center;
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
  `,

  logo: css`
    :host {
      align-content: center;
      display: flex;
      justify-content: center;
    }

    :host > img {
      height: 9px;
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
  `,

  truncateText: css`
    :host {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    :host > b {
      font-family: ${fonts.bold}
    }
  `
}