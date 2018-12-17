'use strict'

const html = require('choo/html')
const { utils } = require('../../../lib/tools')
const { colors } = require('styleUtils')

module.exports = (reedming, earnings, allocatedRewards) =>
  reedming
    ? html`<div class="spinner-tiny-teal" style="display: inline-block;"></div>`
    : [html`<span></span>`, earnings, allocatedRewards ? html`<span style="color:${colors.araOrange};"> (+${utils.roundDecimal(allocatedRewards, 1000)})</span>` : null]
