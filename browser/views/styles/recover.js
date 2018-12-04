'use strict'

const { css } = require('css')
const { fonts, colorSelector } = require('styleUtils')

module.exports = {
  container: css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 90%;
    }
  `,

  inputRow: css`
    :host {
      display: flex;
      justify-content: space-between;
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
      height: 12px;
    }
  `,

  title: css`
    :host {
      font-family: ${fonts.black};
      font-size: 20px;
    }
  `,

  recoverForm: css`
    :host {
      display: flex;
      flex-direction: column;
      height: 70%;
      justify-content: space-between;
    }

    :host div {
      font-size: 13px;
    }

    :host .error-msg {
      color: ${colorSelector('red')};
      font-size: 10px;
      height: 10px;
    }
  `,

  textinputMnemonic: css`
    :host {
      border: 1px solid;
      height: 50px;
      font-size: 14px;
      resize: none;
      width: 100%;
    }
  `
}