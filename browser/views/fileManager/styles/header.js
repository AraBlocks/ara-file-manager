const { css } = require('css')
const { colors, fonts } = require('styleUtils')

module.exports = {
  colors,
  fonts,

  container: css`
    :host {
      display: flex;
      flex-direction: column;
      font-family: ${fonts.light};
      height: 110px;
      justify-content: space-between;
      margin-bottom: 5px;
      padding: 2.5% 2.5%;
    }

    :host:before {
      content: "";
      height: 160px;
      left: 0;
      position: absolute;
      top: 0;
      width: 93%;
      -webkit-app-region: drag;
      z-index: -1;
    }
  `,

  iconHolder: css`
    :host {
      margin-right: 6px;
      width: 20px;
      vertical-align: top;
    }
  `,

  downloadBox: css`
    :host {
      font-size: 14px;
      text-indent: 10px;
      align-items: center;
      box-sizing: border-box;
      border: 1px solid var(--ara-grey);
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 35px;
      margin-top: 0.75em;
      margin-bottom: 0.75em;
      -webkit-app-region: no-drag;
    }
  `,

  subHeader: css`
    :host {
      display: flex;
      font-size: 20px;
      justify-content: space-between;
      height: 35px;
      display: flex;
      align-items: baseline;
    }
  `,

  beta: css`
    :host {
      font-size: 20px;
      height: 35px;
      float: right;
      padding-left: 10px;
    }
  `,

  tabHolder: css`
    :host {
      display: flex;
    }

    :host div {
      cursor: pointer;
      margin-right: 30px;
    }
  `,

  titleHolder: css`
    :host {
      font-size: 36px;
      font-family: ${fonts.black};
      padding-bottom: 20px;
      padding-top: 40px;
    }
  `,

  input: css`
    :host {
      -moz-appearance: textfield;
      -webkit-appearance: textfield;
      background-color: white;
      background-color: -moz-field;
      border: 1px solid darkgray;
      box-shadow: 1px 1px 1px 0 lightgray inset;
      margin-top: 5px;
      padding: 2px 3px;
      width: 398px;
      -webkit-app-region: no-drag;
    }
  `,

  userHolder: css`
    :host {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      font-size: 16px;
      padding-top: 5px;
      padding-bottom: 20px;
    }

    :host b {
      font-family: ${fonts.bold};
    }
  `,

  windowControlsHolder: css`
    :host {
      display: flex;
      justify-content: space-between;
      height: 30px;
    }
  `
}
