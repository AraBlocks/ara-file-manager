'use strict'

const { css } = require('css')
const {
  colorSelector,
  colors,
  fonts,
} = require('styleUtils')

module.exports = {
  colors,
  fonts,

  container: css`
    :host {
      align-items: center;
      box-sizing: border-box;
      border: 1px solid var(--ara-grey);
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  `,

  button: css`
    :host {
      background-color: ${colorSelector('teal')};
      color: white;
      font-size: 12px;
      font-family: ${fonts.light};
      height: 25px;
      margin: 10px;
      width: 70px;
    }

    :host:hover {
      background-color: ${colorSelector('teal', true)};
    }
  `,

  icon: css`
    :host {
      background-image:url(../assets/images/ara_token.png);
      background-repeat: no-repeat;
      background-size: 8%;
      background-position-x: 98%;
      background-position-y: 50%;
    }
  `,

  requiredIndicator: css`
    :host {
      background-color: ${colorSelector('pink')};
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
        font-size: 18px;
        font-family: ${fonts.light};
        height: 45px;
        text-indent: 10px;
        width: 100%;
      }

      :host::placeholder {
        color: var(--ara-grey);
        text-indent: 10px;
      }
    `
  }
}