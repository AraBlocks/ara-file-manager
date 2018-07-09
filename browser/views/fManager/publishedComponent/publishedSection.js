'use strict'

const PublishedRow = require('./publishedRow')
const styles = require('./styles/publishedSection')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PublishedSection extends Nanocomponent {
  constructor({ files }) {
    super()
    this.state = { files: this.makeRows(files) }
  }

  makeRows(files) {
    return files.map(file => new PublishedRow(file))
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
      <div>
        PublishedFiles
        ${state.files}
        ${divider()}
      </div>
      <div>🤷</div>
    `

    function divider() {
      return html`<div class=${styles.divider}>--------</div>`
    }
  }
}

module.exports = PublishedSection