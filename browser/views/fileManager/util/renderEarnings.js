'use strict'

const html = require('nanohtml')
const { utils } = require('../../../lib/tools')
const { colors } = require('styleUtils')

module.exports = (reedming, earnings, allocatedRewards) =>{
  const roundedEarnings = utils.roundDecimal(earnings, 100)
  const roundedRewards = utils.roundDecimal(allocatedRewards, 100)
  return reedming
    ? html`<div class="spinner-tiny-teal" style="display: inline-block;"></div>`
    : [html`<span></span>`, roundedEarnings, roundedRewards ? html`<span style="color:${colors.araOrange};"> (+${roundedRewards})</span>` : null]
}
