'use strict'

const { colorSelector, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  colorSelector,
  fonts,

  header: css`
    :host {
      display: flex;
      font-family: ${fonts.black};
      font-size: 20px;
      width: 90%;
    }
  `,

  description: css`
    :host {
      font-family: ${fonts.light};
      font-size: 12px;
      width: 90%;
    }
  `,

  errorMsg: css`
    :host {
      color: ${colorSelector('red')};
      font-size: 10px;
      height: 13px;
      width: 100%;
    }
  `,

  importContainer: css`
    :host {
      align-self: start;
      font-size: 12px;
      padding-left: 20px;
    }

    :host button {
       font-size: 12px;
       height: 15px;
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

  registerForm: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 160px;
      justify-content: space-between;
      width: 90%;
    }
  `
}