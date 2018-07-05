'use strict'

const { css } = require('../../lib/cssTool/css')
const { colors, colorSelector } = require('../../lib/styleUtils')

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

  tail: css`
    :host {
      height: 5px;
      background-color: red;
    }
  `,

  textHolder: css`
    :host {
      bottom: 8px;
      background-color: white;
      border: .5px solid ${colors.araGrey};
      left: 6px;
      font-size: 12px;
      padding: 5px;
      text-align: center;
      visibility: hidden;
      max-width: 200px;
      position: absolute;
      z-index: 1;
    }
  `,

  tail: css`
      :host {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid red;
        content: "";
        display: block;
        height: 4px;
        position: absolute;
        transform: translateY(0%) translateX(0%) rotate(270deg);
      }
  `
}