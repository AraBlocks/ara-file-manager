'use strict'

const {
  colors,
  colorSelector,
  fonts,
  fontSelector
} = require('styleUtils')
const { css } = require('css')

module.exports = {
  colors,
  fonts,

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
  },

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
}