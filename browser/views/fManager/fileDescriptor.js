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
    const { props, children } = this

    return html`
      <div>
        <div>${props.name}</div>
        <div>${props.size}</div>
        <div>${children.button.render()}</div>
      </div>
    `
  }
}

module.exports = FileDescription