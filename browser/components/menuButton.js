'use strict'

const remote = require('electron').remote
const windowManager = remote.require('electron-window-manager')
const styles = require('./styles/menuButton')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const Separator = require('./separator')

class MenuButton extends Nanocomponent {
  constructor() {
    super()

    this.separator = new Separator()
    this.openMenu.bind(this)
    this.openFileManager.bind(this)
    this.openPublishFile.bind(this)
    this.quit.bind(this)
  }

  update() {
    return true
  }

  openMenu() {
    if(document.getElementById('menu').style.display == "flex") {
      document.getElementById('menu').style.display = "none"
    } else {
      document.getElementById('menu').style.display = "flex"
    }
  }

  openFileManager() {}

  openPublishFile() {}

  logOut() {}

  quit() {
    windowManager.closeAll()
  }

  createElement(chooState) {
    const { separator } = this

    return html`
      <div class=${styles.dropdown}>
        <div class=${styles.menuButton} onclick=${this.openMenu}>
          <div class=${styles.menuBar}></div>
          <div class=${styles.menuBar}></div>
          <div class=${styles.menuBar}></div>
        </div>
        <div class=${styles.dropdownContent} id="menu">
          <div class=${styles.dropdownButton} onclick=${this.openFileManager}>File Manager</div>
          ${separator.render({})}
          <div class=${styles.dropdownButton} onclick=${this.openPublishFile}>Publish File</div>
          ${separator.render({})}
          <div class=${styles.dropdownButton} onclick=${this.logOut}>Log Out</div>
          ${separator.render({})}
          <div class=${styles.dropdownButton} onclick=${this.quit}>Quit</div>
        </div>
      </div> 
    `
  }
}

module.exports = MenuButton