'use strict'

const { css } = require('../../lib/cssTool/css')
const {
  colors,
  fonts,
  colorSelector,
  fontSelector
} = require('../../lib/styles')

module.exports = {
  colors,
  fonts,

  standard() {
    return css`
      :host {
        border: 1px solid var(--ara-input-grey);
        font-size: 20px;
        font-family: ${fonts.light};
        height: 50px;
        text-indent: 10px;
        width: 89%;
      }

      :host::placeholder {
        color: var(--ara-input-grey);
        text-indent: 10px;
      }
    `
  }
}