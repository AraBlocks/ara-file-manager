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

  inactive({
    fontSize = '18',
    height = '2',
    weight = 'bold'
  }) {
    return css`
      :host {
        background-color: var(--ara-grey);
        color: white;
        font-family: ${fontSelector(weight)};
        font-size: ${fontSize}px;
        height: ${height}em;
        transition: all 100ms;
        width: 100%;
        cursor: default;
      }
    `
  } ,

  smallInvisible({
    color  = 'green',
    fontSize = '14',
    weight = 'bold',
    height = '36'
  }) {
    return css`
      :host {
        background-color: white;
        color: ${colorSelector(color)};
        font-family: ${fontSelector(weight)};
        font-size: ${fontSize}px;
        height: ${height}px;
        transition: all 100ms;
        width: 100%;
      }

      :host:hover {
        color: ${colorSelector(color, true)};
      }
    `
  },

  standard({
    color  = 'teal',
    fontSize = '18',
    weight = 'bold',
    height = '2'
  }) {
    return css`
      :host {
        background-color: ${colorSelector(color)};
        color: white;
        font-family: ${fontSelector(weight)};
        font-size: ${fontSize}px;
        height: ${height}em;
        transition: all 100ms;
        width: 100%;
      }

      :host:hover {
        background-color: ${colorSelector(color, true)};
      }
    `
  } ,

  thinBorder({
    color  = 'gray',
    fontSize = '18',
    height = '2',
    weight = 'bold'
  }) {
    return css`
      :host {
        background-color: white;
        border: 1px solid ${colorSelector(color)};
        color: ${colorSelector(color)};
        font-family: ${fontSelector(weight)};
        font-size: ${fontSize}px;
        height: ${height}em;
        transition: all 100ms;
        width: 100%;
        cursor: default;
      }
    `
  } ,
}