'use strict'

const { css } = require('css')

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