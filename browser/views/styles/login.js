'use strict'

const { css } = require('css')
const { fonts } = require('styleUtils')

module.exports = {
  buttonHolder: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      font-family: ${fonts.bold};
    }
  `,

  container: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-around;
    }

    :host > * {
      width: 95%;
    }
  `,

  descriptionHolder: css`
    :host {
      font-size: 12px;
      font-family: ${fonts.light};
    }
  `,

  form: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 190px;
      justify-content: space-between;
      width: 100%;
    }

    :host input {
      width: 94%;
    }

    :host button {
      width: 94%
    }
  `,

  logo: css`
    :host {
      align-content: center;
      display: flex;
      justify-content: center;
      font-size: 12px;
    }

    :host > input {
      width: 100%;
    }
  `,

  title: css`
    :host {
      font-family: ${fonts.boldSpecial};
      font-size: 20px;
    }
  `
}