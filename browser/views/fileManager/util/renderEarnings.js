'use strict'

const html = require('choo/html')
const { colors } = require('styleUtils')

module.exports = (reedming, earnings, allocatedRewards) =>
  reedming
    ? html`<div class="spinner-tiny-red" style="display: inline-block;"></div>`
    : [html`<span></span>`, earnings, allocatedRewards ? html`<span style="color:${colors.araOrange};"> (+${allocatedRewards})</span>` : null]
