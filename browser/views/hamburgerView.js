'use strict'

const Menu= require('../components/hamburgerMenu/menu')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const { colors } = require('../lib/styleUtils')

class HamburgerView extends Nanocomponent {
  constructor() {
    super()

    this.menu = new Menu({
      items: [{ children: "File Manager" }, { children: "Quit" }]
    })
    window.hamburger = this
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { menu } = this

    return html`
      <div class="popup">
        ${menu.render()}
      </div>`
  }
}

module.exports = HamburgerView