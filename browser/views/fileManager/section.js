const itemRow = require('./itemRow')
const styles = require('./styles/section')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const box = require('component-box')

box.use({ itemRow })

class Section extends Nanocomponent {
  constructor({ type = '' }) {
    super()
    this.props = { typeRow: type }
    this.makeRows = this.makeRows.bind(this)
    this.box = box
  }

  makeRows(files) {
    const { typeRow } = this.props
    return files[typeRow].map((file, i) => {
      const constructorArgs = [{ file, typeRow }]
      return box('itemRow', { key: file.did, constructorArgs })
        .render({ ...file, index: i }, i === files[typeRow].length -1)
    })
  }

  update() {
    return true
  }

  createElement({ files }) {
    const { props, makeRows } = this
    return (html`
      <div>
        <div class="${styles.header} section-header">
          ${props.typeRow === 'purchased' ? 'Purchased Files' : 'Published Files'}
        </div>
        <div class="${styles.separator} section-separator"></div>
        ${makeRows(files)}
      </div>
    `)
  }
}

module.exports = Section