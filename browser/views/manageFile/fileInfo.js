const { events } = require('k')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

const Input = require('../../components/input')
const FileTable = require('../../components/afsFileTable/editableFileTable')
const styles = require('./styles/fileInfo')

class FileInfo extends Nanocomponent {
  constructor({
    addItems,
    did,
    oninput,
    parentState,
    renderView
  }) {
    super()

    this.props = { did, parentState, renderView }

    this.children = {
      fileNameInput: new Input({
        oninput: oninput('name'),
        placeholder: 'File Name',
        value: this.props.parentState.name
      }),
      fileTable: new FileTable({
        addItems,
        did,
        parentState,
        field: 'fileList',
        tableType: events.UPDATE_FILE,
        renderView
      }),
      priceInput: new Input({
        araIcon: true,
        placeholder: 'Price',
        type: 'number',
        oninput: oninput('price'),
        value: this.props.parentState.price
      })
    }
  }

  update({ parentState }) {
    this.props = { parentState }
    // handles users who think `-0` is a funny price
    parentState.price = Math.abs(parentState.price).toString() || ''
    return true
  }

  createElement() {
    const { children, props: { parentState } } = this
    return html`
      <div class="${styles.container} manageFile-fileInfo-container">
        <div class=${styles.verticalContainer}>
          <div class=${styles.infoTipHolder}>
            ${children.fileNameInput.render({ value: parentState.name })}
            <div class=${styles.infoTip}>
              <div>
                <b>Recommended:</b> If this field is left blank, users will only
                see the package's generic Ara ID.
              </div>
            </div>
          </div>
          <div class=${styles.infoTipHolder}>
            ${children.priceInput.render({ value: parentState.price })}
            <div class=${styles.infoTip}>
              Leave blank if you do not want to charge for this file.
            </div>
            <div class=${styles.araPriceHolder}>
              <b>Ara Token Price:</b>
              <div class=${styles.araPrice}>
                <b>${parentState.tokenPrice} Ara</b>
              </div>
            </div>
          </div>
        </div>
        <div class="${styles.fileTable} manageFile-fileTable">
          ${children.fileTable.render()}
        </div>
      </div>
    `
  }
}

module.exports = FileInfo
