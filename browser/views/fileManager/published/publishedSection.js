'use strict'

const ItemRow = require('../itemRow')
const styles = require('./styles/publishedSection')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PublishedSection extends Nanocomponent {
  constructor({ files }) {
    super()
    this.state = { files: this.makeRows(files) }
  }

  makeRows(files) {
    return files.map(file => new ItemRow({ ...file, typeRow: 'published' }))
  }

  update({ files }) {
    const { makeRows, state } = this

    if (files.length !== state.files.length) {
      state.files = makeRows(files)
    }
    return true
  }

  createElement() {
    const { state } = this

    return html`
      <div class="${styles.container} publishedSection-container">
        <div>
          Published Files
        </div>
        <div class="${styles.separator} publishedSection-seperator"></div>
        ${state.files.map(file => file.render())}
      </div>
    `
  }
}

module.exports = PublishedSection