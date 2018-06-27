'use strict'

const {
  colors,
  fonts,
  colorSelector,
  fontSelector
} = require('../../lib/styles')
const { css } = require('../../lib/cssTool/css')

module.exports = {
  colors,
  fonts,

  standard({ color = 'red'}) {
    return css`
      :host {
        background-color: ${colorSelector(color)};
        color: white;
        font-family: ${fonts.bold};
        font-size: 18px;
        height: 50px;
        width: 90%;
      }
    `
  } ,

  smallInvisible({ color  = 'red', weight = 'bold' }) {
    return css`
      :host {
        background-color: white;
        color: ${colorSelector(color)};
        font-family: ${fontSelector(weight)};
        font-size: 14px;
        height: 30px;
        width: 90%;
      }
    `
  }
}