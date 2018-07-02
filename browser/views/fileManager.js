'use strict'

const remote = require('electron').remote;
const windowManager = remote.require('electron-window-manager')
const styles = require('./styles/fileManager')
const html = require('choo/html')
const Button = require('../components/modalButton')
const { registration } = require('../lib/store')
const Nanocomponent = require('nanocomponent')
const isDev = require('electron-is-dev')

class FileManager extends Nanocomponent {
  constructor() {
    super()
    this.cancelButton = new Button({
      children: 'Open File Manager',
      cssClass: {
        name: 'smallInvisible',
        opts: {
          color: 'blue',
          weight: 'bold'
        }
      }
    })

    this.expandWindow.bind(this)
    this.closeWindow.bind(this)
    this.openMenu.bind(this)
  }

  expandWindow() {
    windowManager.get("fileManager.js").object.setSize(400, 600)
  }

  closeWindow() {
    windowManager.get("fileManager.js").object.close()
  }

  openMenu() {
    if(document.getElementById('menu').style.display == "flex") {
      document.getElementById('menu').style.display = "none"
    } else {
      document.getElementById('menu').style.display = "flex"
    }
  }

  update() {
    return true
  }

  createElement() {
    const {
      cancelButton
    } = this

    return html`
      <div class=${styles.verticalContainer}>
        <div class="${styles.horizontalContainer} ${styles.centerAlign}">
          <div class=${styles.dropdown}>
            <button class=${styles.dropbtn} onclick=${this.openMenu}>Dropdown 
              <i class="fa fa-caret-down"></i>
            </button>
            <div class="${styles.dropdownContent}" id="menu">
              <div>File Manager</div>
              <div>Publish File</div>
              <div>Log Out</div>
              <div>Quit</div>
            </div>
          </div> 
          <div class=${styles.header}>LTLSTAR</div><button onclick=${this.closeWindow}>close</button>
        </div>
        <div class=${styles.subHeader}>Wallet</div>


        <div class=${styles.verticalContainerSmall}>
          <div class="${styles.horizontalContainer} ${styles.bottomAlign}">
            <div class=${styles.price}>9999.99</div><div class=${styles.ara}>ARA</div>
          </div>
          <div class=${styles.content}><b>Current Exchange Value</b>: 1.0 ARA = $1.73 USD</div>
        </div>

        <div class=${styles.verticalContainerSmall}>
          <div class=${styles.horizontalContainer}><div class=${styles.subHeader}>Files</div><button class=${styles.expandButton} onclick=${this.expandWindow}>Expand</button></div>
          <div class=${styles.line}></div>
          ${cancelButton.render({})}
        </div>
      </div>
    `
  }
}

module.exports = FileManager