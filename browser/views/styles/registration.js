'use strict'

const { colors, fonts, overlay } = require('styleUtils')
const { css } = require('css')

module.exports = {
  colors,
  fonts,
  overlay,

  header: css`
    :host {
      display: flex;
      font-family: ${fonts.bold};
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

  registerForm: css`
    :host {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 120px;
      justify-content: space-between;
      width: 90%;
    }
  `
}