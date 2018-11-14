'use strict'

const html = require('choo/html')
module.exports = (
  reedming,
  earnings,
  allocatedRewards
) =>
  reedming
    ? html`<div class="spinner-tiny-red" style="display: inline-block;></div>`
    : [earnings, allocatedRewards ? html`<span style="color:green;">(+${allocatedRewards})</span>` : null]
