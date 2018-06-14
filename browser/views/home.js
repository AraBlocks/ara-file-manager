'use strict'

const styles = require('./styles/home')
const html = require('choo/html')

const home = (state, emit) => html`
  <div class=${styles.container}>
    <div>
      Welcome to ARA Mananger!
    </div>
  </div>
`

module.exports = home