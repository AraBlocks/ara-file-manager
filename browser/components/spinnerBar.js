'use strict'

const styles = require('./styles/spinnerBar')
const html = require('nanohtml')

module.exports = () =>
  html`
    <div class="${styles.spinnerBars} spinnerBar-spinnerBars">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
  `