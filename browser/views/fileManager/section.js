'use strict'

const ItemRow = require('./itemRow')
const styles = require('./styles/section')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class Section extends Nanocomponent {
  constructor({ type = '' }) {
    super()
    this.props = { typeRow: type }
  }

  update() {
    return true
  }

  createElement({ files }) {
    const { props: { typeRow } } = this
    const fileRows = files[typeRow].map((file) => new ItemRow({ file, typeRow }))
    return html`
      <div class="${styles.container} section-container">
        <div class="${styles.header} section-header">
          ${typeRow === 'purchased' ? 'Purchased Files' : 'Published Files'}
        </div>
        <div class="${styles.separator} section-separator"></div>
        ${fileRows.map((file, i) => file.render({
          ...files[typeRow][i],
          last: i === fileRows.length - 1
        }))}
      </div>
    `
  }
}

module.exports = Section