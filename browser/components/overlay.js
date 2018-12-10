'use strict'

const html = require('choo/html')

module.exports = (pending, text = null) => pending
  ? html`
    <div class="overlay">
      <div>
        <div>${text}</div>
        <div class="spinner"></div>
      </div>
    </div>`
  : html`<div style="display: none;"></div>`