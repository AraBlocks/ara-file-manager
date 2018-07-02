'use strict'

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
          <button>menu</button><div class=${styles.header}>LTLSTAR</div><button>close</button>
        </div>
        <div class=${styles.subHeader}>Wallet</div>


        <div class=${styles.verticalContainerSmall}>
          <div class="${styles.horizontalContainer} ${styles.bottomAlign}">
            <div class=${styles.price}>9999.99</div><div class=${styles.ara}>ARA</div>
          </div>
          <div class=${styles.content}><b>Current Exchange Value</b>: 1.0 ARA = $1.73 USD</div>
        </div>
        
        <div class=${styles.verticalContainerSmall}>
          <div class=${styles.horizontalContainer}><div class=${styles.subHeader}>Files</div><button class=${styles.expandButton}>Expand</button></div>
          <div class=${styles.line}></div>
          ${cancelButton.render({})}
        </div>
      </div>
    `
  }
}

module.exports = FileManager