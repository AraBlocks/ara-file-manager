'use strict'

const { css } = require('css')
const { fonts, colorSelector } = require('styleUtils')

module.exports = {
  container: css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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
      height: 9px;
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
      height: 80%;
      justify-content: space-between;
    }

    :host div {
      font-size: 13px;
    }

    :host div > b {
      font-family: ${fonts.bold};
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