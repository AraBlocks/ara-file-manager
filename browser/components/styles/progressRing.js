'use strict'

const { colors } = require('../../lib/styleUtils')
const { css } = require('../../lib/cssTool/css')

module.exports = {
  colors,

  container: css`
    :host {
      cursor: pointer;
    }
  `,

  colorSelector(status) {
    let color
    switch (status) {
      case 0 :
        color = colors.araGrey
        break
      case 1 :
        color = colors.araRed
        break
      default :
        color = colors.araBlue
    }
    return color
  },

  progressRing: css`
    :host {
      cursor: pointer;
      transition: 0.1s stroke-dashoffset;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }
  `
}