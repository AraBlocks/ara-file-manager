'use strict'

const { colors, colorSelector } = require('styleUtils')
const { css } = require('css')

module.exports = {
  colors,

  container({ tooltipColor = 'black', size = '8px' }) {
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
  }
}