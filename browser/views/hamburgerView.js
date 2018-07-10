'use strict'

const Menu= require('../components/hamburgerMenu/menu')
const UtilityButton = require('../components/utilityButton')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const { colors } = require('styleUtils')

class HamburgerView extends Nanocomponent {
	constructor() {
  	super()

  	this.menu = new Menu({
    	items: [{ children: 'File Manager' }, { children: 'Quit' }]
		})
  	this.close = new UtilityButton({ children: '✕' })
  	this.expand = new UtilityButton({ 
	    children: '▼',
	    onclick: () => console.log("expand") 
    })
    window.hamburger = this
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { menu, close, expand } = this

    return html`
      <div class="popup">
        ${menu.render()}
        ${close.render()}
        ${expand.render()}
      </div>`
  }
}

module.exports = HamburgerView