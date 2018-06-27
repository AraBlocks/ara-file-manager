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
        font-family: ${fonts.light}
        height: 50px;
        padding-left: 1em;
        width: 90%;
      }

      :host::placeholder {
        color: var(--ara-input-grey);
      }
    `
  }
}