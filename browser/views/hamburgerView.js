'use strict'

const ManagerMenuItem= require('./managerMain/managerMenuItem')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const { colors } = require('styleUtils')

class HamburgerView extends Nanocomponent {
  constructor() {
    super()

    this.hamburger = new ManagerMenuItem({
      children: "File Manager", 
      onclick: () => console.log("click")
    })
    window.hamburger = this
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { hamburger } = this

    return html`
      <div class="popup">
        <div style="
          width: 115px;
          height: 140px;
          border: 1px solid #cbcbcb;
        ">
        ${hamburger.render()}
        <div style="
          width: 100%;
          height: 1px;
          background-color: ${colors.araGrey};
        "></div>
        ${hamburger.render()}
        <div style="
          width: 100%;
          height: 1px;
          background-color: ${colors.araGrey};
        ">
        </div>
      </div>`
  }
}

module.exports = HamburgerView