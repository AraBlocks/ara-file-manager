'use strict'

const { colors, colorSelector, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  colors,
  colorSelector,
  fonts,

  container(clicked) {
     return css`
      :host {
        align-items: center;
        background-color: white;
        border: 1px ${colors.araGrey} solid;
        border-width: 0px 1px;
        cursor: pointer;
        display: block;
        font-family: ${fonts.light};
        height: 2em;
        line-height: 2em;
        overflow: hidden;
        padding: 0 5px;
        text-align: center;
        text-overflow: ellipsis;
        transition: font-weight 100ms;
        transition: color 500ms;
        vertical-align: middle;
        -webkit-app-region: no-drag;
        z-index: 9999;
        ${clicked && 'font-weight: bold;'}
        ${clicked && 'color: var(--ara-orange);'}
      }

      :host:hover {
        background-color: #e2e2e2;
      }
    `
  }
}