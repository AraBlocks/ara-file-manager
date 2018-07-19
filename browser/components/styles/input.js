'use strict'

const { css } = require('css')
const {
  colors,
  fonts,
} = require('styleUtils')

module.exports = {
  colors,
  fonts,

  container: css`
    :host {
      align-items: center;
      border: 1px solid var(--ara-input-grey);
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  `,

  button: css`
    :host {
      background-color: ${colors.araBlue};
      color: white;
      font-size: 15px;
      font-family: ${fonts.light};
      height: 30px;
      margin: 10px;
      width: 60px;
    }
  `,

  selection: css`
    :host {
      font-size: 12px;
      font-family: ${fonts.bold};
      margin: 5px;
    }
  `,

  standard() {
    return css`
      :host {
        font-size: 20px;
        font-family: ${fonts.light};
        height: 50px;
        text-indent: 10px;
        width: 100%;
      }

      :host::placeholder {
        color: var(--ara-input-grey);
        text-indent: 10px;
      }
    `
  }
}