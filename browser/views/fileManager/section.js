'use strict'

const ItemRow = require('./itemRow')
const styles = require('./styles/section')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Section extends Nanocomponent {
  constructor({ type = '' }) {
    super()

    this.props = { typeRow: type }
  }

  makeRows(files) {
    const { props: { typeRow } } = this
    return files.map(file => new ItemRow({ ...file, typeRow }))
  }

  update() {
    return true
  }

  createElement({ files }) {
    const { props: { typeRow } } = this
    const fileRows = files.map(file => new ItemRow({ ...file, typeRow }))
    return html`
      <div class="${styles.container} section-container">
        <div class="${styles.header} section-header">
          ${props.typeRow === 'purchased' ? 'Purchased' : 'Published Files'}
        </div>
        <div class="${styles.separator} section-separator"></div>
        ${fileRows.map((file, i) => file.render({ ...files[props.typeRow][i]}))}
      </div>
    `
  }
}

module.exports = Section