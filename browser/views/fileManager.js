'use strict'

const Nanocomponent = require('nanocomponent')
const html = require('choo/html')

class FileManager extends Nanocomponent {
  constructor() {
    super()
  }

  update() {
    return true
  }

  createElement() {
    return html`
      <div>hello this is file manager</div>
    `
  }
}

module.exports = FileManager