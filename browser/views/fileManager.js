'use strict'

const remote = require('electron').remote;
const windowManager = remote.require('electron-window-manager')
const styles = require('./styles/fileManager')
const html = require('choo/html')
const Button = require('../components/modalButton')
const MenuButton = require('../components/menuButton')
const { registration } = require('../lib/store')
const Nanocomponent = require('nanocomponent')
const isDev = require('electron-is-dev')

class FileManager extends Nanocomponent {
  constructor() {
    super()
    this.fileManagerButton = new Button({
      children: 'Open File Manager',
      cssClass: {
        name: 'smallInvisible',
        opts: {
          color: 'blue',
          weight: 'bold'
        }
      }
    })

    this.menuButton = new MenuButton()
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
      fileManagerButton,
      menuButton
    } = this

    return html`
      <div class=${styles.verticalContainer}>
        <div class="${styles.horizontalContainer} ${styles.centerAlign}">
          ${menuButton.render({})}
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
          ${fileManagerButton.render({})}
        </div>
      </div>
    `
  }
}

module.exports = FileManager