'use strict'

const html = require('choo/html')
const styles = require('./styles.js/fileDescriptor')
const PlaceHolderButton = require('../../components/button')
const ProgressRing = require('../../components/progressRing')
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
      }),

      progressRing: new ProgressRing({
        status,
        downloadPercent,
        parentRender: this.render.bind(this),
        parentState: this.state
       })
    }
  }

  update() {
    return true
  }

  createElement() {
    const {
      children,
      props,
      state : { downloadPercent, status }
    } = this

    return html`
      <div class="${styles.container}">
        <div class="${styles.iconHolder} iconHolder">
          ${children.progressRing.render({ downloadPercent })}
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
          <div class="${styles.sizeHolder(status)} sizeHolder">
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