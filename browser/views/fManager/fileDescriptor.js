'use strict'

const html = require('choo/html')
const styles = require('./styles.js/fileDescriptor')
const PlaceHolderButton = require('../../components/button')
const Nanocomponent = require('nanocomponent')

class FileDescription extends Nanocomponent {
  constructor({ name, size, downloadPercent, status }) {
    super()

    this.props = {
      name,
      size
    }

    this.state = {
      downloadPercent,
      status
    }

    this.children = {
      button: new PlaceHolderButton({
        children: 'Open in Folder',
        cssClass: {
          name: 'smallInvisible',
          opts: { color: 'blue' }
         }
      })
    }
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { children, props, state } = this

    return html`
      <div class="${styles.container}">
        <div class="${styles.iconHolder} iconHolder">
          <div class="${styles.tempIcon}"></div>
        </div>
        <div class="${styles.summaryHolder} summaryHolder">
          <div class="${styles.nameHolder} nameHolder">
            <div>
              ${props.name}
            </div>
            <div class="${styles.toolTipHolder}">
              <div class="${styles.tempToolTip} tempToolTip"></div>
            </div>
          </div>
          <div class="${styles.sizeHolder(state.status)} sizeHolder">
            ${props.size} gb
          </div>
          <div class="${styles.buttonHolder} buttonHolder">
            ${children.button.render()}
          </div>
        </div>
      </div>
    `
  }
}

module.exports = FileDescription