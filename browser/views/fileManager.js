'use strict'

const remote = require('electron').remote
const windowManager = remote.require('electron-window-manager')
const styles = require('./styles/fileManager')
const html = require('choo/html')
const Button = require('../components/modalButton')
const MenuButton = require('../components/menuButton')
const UtilityButton = require('../components/utilityButton')
const Separator = require('../components/separator')
const Nanocomponent = require('nanocomponent')

class FileManager extends Nanocomponent {
  constructor() {
    super()

    this.children = {
      menuButton: new MenuButton(),
      separator: new Separator(),
      closeButton: new UtilityButton({ type: 'close' }),
      expandWindowButton: new UtilityButton( { type: 'expand', 
        onclick: () => { 
          let window = windowManager.get('fileManager.js').object
          if (window.getSize()[1] == 600) {
            window.setSize(400, 400)
          } else {
            window.setSize(400, 600)
          }
        } 
      }),
      fileManagerButton: new Button({
        children: 'Open File Manager',
        cssClass: {
          name: 'smallInvisible',
          opts: {
            color: 'black',
            weight: 'bold'
          }
        }
      })
    }
  }

  update() {
    return true
  }

  createElement() {
    const {
      children
    } = this

    return html`
      <div class=${styles.verticalContainer}>
        <div class="${styles.horizontalContainer} ${styles.centerAlign}">
          ${children.menuButton.render({})}
          <div class=${styles.header}>LTLSTR</div>
          ${children.closeButton.render({})}
        </div>

        <div class=${styles.subHeader}>Wallet</div>

        <div class=${styles.verticalContainerSmall}>
          <div class="${styles.horizontalContainer} ${styles.bottomAlign}">
            <div class=${styles.price}>9999.99</div>
            <div class=${styles.ara}>ARA</div>
          </div>
          <div class=${styles.content}>
            <b>Current Exchange Value</b>: 1.0 ARA = $1.73 USD
          </div>
        </div>

        <div class=${styles.verticalContainerSmall}>
          <div class=${styles.horizontalContainer}>
            <div class=${styles.subHeader}>Files</div>
            ${children.expandWindowButton.render({})}
          </div>
          ${children.separator.render({})}
          ${children.fileManagerButton.render({})}
        </div>
      </div>
    `
  }
}

module.exports = FileManager