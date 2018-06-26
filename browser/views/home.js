'use strict'

const styles = require('./styles/home')
const html = require('choo/html')

const home = (state, emit) => html`
  <div class=${styles.container}>
    <div class="scroll-left">
      <p>Welcome to ARA Mananger!</p>
      <br>
      <p>the future is now 😏</p>
    </div>
  </div>
`

module.exports = home