const { css } = require('css')
const { buttonSelector, colorSelector, fonts } = require('styleUtils')

module.exports = {
  buttonSelector,

  araID: css`
    :host {
      overflow: hidden;
      font-size: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 98%;
    }
  `,

  araIDHolder: css`
    :host {
      align-items: center;
      background-color: aliceBlue;
      border: 1px solid #97c7f0;
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      font-weight: bold;
      justify-content: center;
      margin-bottom: 10px;
      padding: 10px 2px;
      height: 15%;
      width: 350px;
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

  container({ justifyContent = 'space-between', height = 90, width = 90 }) {
    return css`
      :host {
        align-items: center;
        display: flex;
        flex-direction: column;
        height: ${height}%;
        justify-content: ${justifyContent};
        overflow-wrap: break-word;
        text-align: center;
        width: ${width}%;
      }

      :host > div {
        width: ${width}%;
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
      height: 100%;
      justify-content: space-around;
      width: 90%;
    }
  `,

  contentHolder: css`
    :host {
      display: flex;
      height: 65%;
      flex-direction: column;
      justify-content: space-between;
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

  publishingContainer: css`
    :host {
      display: flex;
      height: 70%;
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

  boldLabel: css`
    :host {
      font-family: ${fonts.bold};
      margin: 10px;
      font-size: 16px;
    }
  `,

  copyItemContainer: css`
    :host {
      display: flex !important;
      justify-content: space-between;
      flex-direction: column;
      height: 80px;
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

  smallMessage({ color  = 'black' }) {
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
      font-size: 4px;
      justify-content: center;
    }
  `,

  progressHolder: css`
    :host {
      display: flex;
      height: 70px;
      font-size: 4px;
      justify-content: center;
    }
  `,

  circle({ color = 'grey' }) {
    return css`
      :host {
        background: ${colorSelector(color)};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        justify-content: center;
        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(125%);
      }
    `
  },

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
  `,

  creating: css`
    :host {
      width: 25%;
    }
  `,

  writing: css`
    :host {
      width: 50%;
    }
  `,

  finalizing: css`
    :host {
      width: 25%;
    }
  `
}
