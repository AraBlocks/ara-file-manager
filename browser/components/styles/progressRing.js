'use strict'

const { AWAITING_DOWNLOAD, DOWNLOADING,} = require('../../../lib/constants/stateManagement')
const { colors } = require('styleUtils')
const { css } = require('css')

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
      case AWAITING_DOWNLOAD:
        color = colors.araGrey
        break
      case DOWNLOADING:
        color = colors.araRed
        break
      default:
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