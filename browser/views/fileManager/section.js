'use strict'

const ItemRow = require('./itemRow')
const styles = require('./styles/section')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Section extends Nanocomponent {
  constructor({
    files = [],
    type = ''
   }) {
    super()

    this.props = { typeRow: type }
    this.state = { files: this.makeRows(files) }
  }

  makeRows(files) {
    const { props: { typeRow } } = this
    return files.map(file => new ItemRow({ ...file, typeRow }))
  }

  update({ files }) {
    const { makeRows, state } = this

    if (files.length !== state.files.length) {
      state.files = makeRows(files)
    }
    return true
  }

  createElement() {
    const { props, state } = this

    return html`
      <div class="${styles.container} section-container">
        <div class="${styles.header} section-header">
          ${headerText()}
        </div>
        <div class="${styles.separator} section-separator"></div>
        ${state.files.map(file => file.render())}
      </div>
    `

    function headerText() {
      let text
      switch (props.typeRow) {
        case 'purchased':
          text = 'Purchased Files'
          break
        default:
          text = 'Published Files'
      }
      return text
    }
  }
}

module.exports = Section