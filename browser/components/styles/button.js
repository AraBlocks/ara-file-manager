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

  smallInvisible({
    color  = 'red',
    fontSize = '14',
    weight = 'bold'
  }) {
    return css`
      :host {
        background-color: white;
        color: ${colorSelector(color)};
        font-family: ${fontSelector(weight)};
        font-size: ${fontSize}px;
        height: 30px;
        transition: all 100ms;
        width: 90%;
      }

      :host:hover {
        color: ${colorSelector(color, true)};
      }
    `
  },

  standard({
    color  = 'red',
    fontSize = '18',
    weight = 'bold'
  }) {
    return css`
      :host {
        background-color: ${colorSelector(color)};
        color: white;
        font-family: ${fontSelector(weight)};
        font-size: ${fontSize}px;
        height: 2em;
        transition: all 100ms;
        width: 100%;
      }

      :host:hover {
        background-color: ${colorSelector(color, true)};
      }
    `
  } ,
}