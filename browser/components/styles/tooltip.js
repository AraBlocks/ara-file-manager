'use strict'

const { colors, colorSelector } = require('styleUtils')
const { css } = require('css')

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

  textHolder({
    maxWidth = 200
  }) {
    return css`
      :host {
        background-color: white;
        border: .5px solid ${colors.araGrey};
        cursor: default;
        font-size: 12px;
        margin-left: 2px;
        margin-top: -115px;
        max-width: ${maxWidth}px;
        opacity: .85;
        padding: 5px;
        text-align: center;
        visibility: hidden;
        position: absolute;
        z-index: 1;
        position: fixed;
      }
    `
  }
}