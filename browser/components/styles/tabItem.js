'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  tab(isActive) {
    return css`
      :host {
        color: ${isActive ? 'var(--ara-green)' : 'black'};
        font-family: ${fonts.regular};
        font-size: 14px;
        transition: all 50ms ease-in-out;
      }

      ${!isActive &&
        `:host:hover {
          transform: scale(1.1);
        }`
      }
    `
  }
}