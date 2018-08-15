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
    return files.map(file => new ItemRow({ ...file }))
  }

  update() {
    return true
  }

  createElement({ files }) {
    const { props } = this
    const fileRows = this.makeRows(files[props.typeRow])
    return html`
      <div class="${styles.container} section-container">
        <div class="${styles.header} section-header">
          ${headerText()}
        </div>
        <div class="${styles.separator} section-separator"></div>
        ${fileRows.map((file, i) => file.render({
          downloadPercent: file.downloadPercent,
          status: file.status,
          fileInfo: files[props.typeRow][i]
         }))}
      </div>
    `

    function headerText() {
      let text
      switch (props.typeRow) {
        case 'purchased':
          text = 'Purchased'
          break
        default:
          text = 'Published Files'
      }
      return text
    }
  }
}

module.exports = Section