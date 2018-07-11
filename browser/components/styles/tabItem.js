'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
  tab(isActive) {
    return css`
      :host {
        color: ${isActive ? colors.araRed : 'black'};
        font-family: ${isActive ? fonts.bold : fonts.regular};
        font-size: 14px;
      }
    `
  }
}