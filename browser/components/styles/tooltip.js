'use strict'

const { colors, colorSelector } = require('../../lib/styleUtils')
const { css } = require('../../lib/cssTool/css')

module.exports = {
  colors,

  container({
    tooltipColor = 'black',
    size = '8px'
  }) {
    return css`
      :host {
        cursor: pointer;
        display: flex;
        border: 1px solid ${colorSelector(tooltipColor)};
        border-radius: 50%;
        color: ${colorSelector(tooltipColor)};
        font-size: ${size};
        height: ${size};
        justify-content: center;
        width: ${size};
        word-wrap: break-word;
        position: relative;
      }

      :host:hover div {
        visibility: visible;
      }
    `
  },

  textHolder: css`
    :host {
      bottom: 8px;
      background-color: white;
      border: .5px solid ${colors.araGrey};
      font-size: 12px;
      left: 6px;
      max-width: 200px;
      padding: 5px;
      text-align: center;
      visibility: hidden;
      position: absolute;
      z-index: 1;
    }
  `
}