'use strict'

const remote = require('electron').remote;
const windowManager = remote.require('electron-window-manager')
const styles = require('./styles/fileManager')
const html = require('choo/html')
const Button = require('../components/modalButton')
const MenuButton = require('../components/menuButton')
const UtilityButton = require('../components/utilityButton')
const Separator = require('../components/separator')
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
          color: 'black',
          weight: 'bold'
        }
      }
    })

    this.menuButton = new MenuButton()
    this.separator = new Separator()
    this.closeButton = new UtilityButton({ type: 'close' })
    this.expandWindowButton = new UtilityButton( { type: 'expand', 
      onclick: () => { 
        let window = windowManager.get('fileManager.js').object
        if (window.getSize()[1] == 600) {
          window.setSize(400, 400)
        } else {
          window.setSize(400, 600)
        }
      } 
    })
    this.expandWindow.bind(this)
  }

  expandWindow() {
    
  }

  update() {
    return true
  }

  createElement() {
    const {
      fileManagerButton,
      menuButton,
      closeButton, 
      expandWindowButton,
      separator
    } = this

    return html`
      <div class=${styles.verticalContainer}>
        <div class="${styles.horizontalContainer} ${styles.centerAlign}">
          ${menuButton.render({})}
          <div class=${styles.header}>LTLSTAR</div>
          ${closeButton.render({})}
        </div>

        <div class=${styles.subHeader}>Wallet</div>

        <div class=${styles.verticalContainerSmall}>
          <div class="${styles.horizontalContainer} ${styles.bottomAlign}">
            <div class=${styles.price}>9999.99</div>
            <div class=${styles.ara}>ARA</div>
          </div>
          <div class=${styles.content}><b>Current Exchange Value</b>: 1.0 ARA = $1.73 USD</div>
        </div>

        <div class=${styles.verticalContainerSmall}>
          <div class=${styles.horizontalContainer}>
            <div class=${styles.subHeader}>Files</div>
            ${expandWindowButton.render({})}
          </div>
          ${separator.render({})}
          ${fileManagerButton.render({})}
        </div>
      </div>
    `
  }
}

module.exports = FileManager