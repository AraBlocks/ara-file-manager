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
        text-shadow: ${isActive ? '1px' : '0px'} 0 0 currentColor;
      }

      ${!isActive &&
        `:host:hover {
          transform: scale(1.1);
        }`
      }
    `
  }
}