const AfsFileRow = require('./afsFileRow')
const fileListSorter = require('../../lib/tools/fileListUtil')
const UtilityButton = require('../../components/utilityButton')
const { fileSystemManager } = require('../../lib/tools')
const styles = require('./styles/editableFileTable')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

const IS_WINDOWS = process.platform === 'win32'
const IS_LINUX = process.platform === 'linux'

class EditableFileTable extends Nanocomponent {
  constructor(opts) {
    super()
    this.props = opts
    this.state = {
      sortNameReversed: true,
      sortSizeReversed: false,
      sortTypeReversed: false
    }
    this.children = {
      sortFileButton: new UtilityButton({
        children: 'upArrow',
        onclick: this.sortFileName.bind(this)
      }),
      sortTypeButton: new UtilityButton({
        children: 'downArrow',
        onclick: this.sortFileType.bind(this)
      }),
      sortSizeButton: new UtilityButton({
        children: 'downArrow',
        onclick: this.sortFileSize.bind(this)
      }),
    }
    this.deleteFile = this.deleteFile.bind(this)
    this.getFiles = this.getFiles.bind(this)
    this.getFolders = this.getFolders.bind(this)
    this.onFileDrop = this.onFileDrop.bind(this)
    this.preventDefault = this.preventDefault.bind(this)
    this.renderAddOpts = this.renderAddOpts.bind(this)
  }

  update() {
    return true
  }

  makeFileRows() {
    const { props, deleteFile } = this
    return props.parentState[props.field].map(fileInfo => new AfsFileRow({
      did: props.did,
      fileInfo,
      deleteFile,
      rowType: props.tableType
    }))
  }

  preventDefault(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  onFileDrop(e) {
    this.preventDefault(e)
    const { props } = this
    const rawFileData = e.dataTransfer.files
    const fileData = Array.from(rawFileData).map(file =>
      ({
        isFile: file.type !== "",
        subPath: file.name,
        fullPath: file.path,
        size: file.size
      })
    )
    props.parentState[props.field].push(...fileData)
    props.renderView()
  }

  deleteFile(fileInfo) {
    const { props } = this
    props.parentState[props.field] = props.parentState[props.field].filter(file =>
      fileInfo.fullPath == null
      ? file.subPath !== fileInfo.subPath
      : file.fullPath !== fileInfo.fullPath
    )
    props.renderView()
  }

  async getFiles() {
    let files
    (IS_WINDOWS || IS_LINUX)
      ? files = await fileSystemManager.showSelectFileDialog()
      : files = await fileSystemManager.showSelectFileAndFolderDialog()
    this.props.addItems(files)
  }

  async getFolders() {
    const folders = await fileSystemManager.showSelectDirectoryDialog()
    this.props.addItems(folders)
  }

  renderAddOpts(length) {
    const { getFiles, getFolders } = this
    return length
      ? html`
        <div class="${styles.addOptions} editableFileTable-addOptions">
          <span class="${styles.add()} editableFileTable-add" onclick="${getFiles}">
            Add file +
          </span>
          <span class="${styles.add(IS_WINDOWS || IS_LINUX)} editableFileTable-add" onclick="${getFolders}">
            Add folder +
          </span>
        </div>
      `
      : html`
        <div class="${styles.dragDropMsg} editableFileTable-dragDropMsg">
          Drop files here
          <div>
            Or 
            <span class="${styles.add()} editableFileTable-add" onclick="${getFiles}">
              add files
            </span>
            <span class="${styles.add(IS_WINDOWS || IS_LINUX)} editableFileTable-add" onclick="${getFolders}">
              / add folders
            </span>
            from finder
          </div>
        </div>
      `
  }

  sortFileName() {
    const { props, state } = this
    fileListSorter.sortTextAttribute({
      fileList: props.parentState[props.field],
      attribute: 'subPath',
      reversed: state.sortNameReversed
    })
    state.sortNameReversed = !state.sortNameReversed
    props.renderView()
  }

  sortFileSize() {
    const { props, state } = this
    fileListSorter.sortNumericAttribute({
      fileList: props.parentState[props.field],
      attribute: 'size',
      reversed: state.sortSizeReversed
    })
    state.sortSizeReversed = !state.sortSizeReversed
    props.renderView()
  }

  sortFileType() {
    const { props, state } = this
    fileListSorter.sortFileType({
      fileList: props.parentState[props.field],
      reversed: state.sortTypeReversed
    })
    state.sortTypeReversed = !state.sortTypeReversed
    props.renderView()
  }

  createElement() {
    const {
      children,
      preventDefault,
      onFileDrop,
      state,
      renderAddOpts
    } = this

    const fileRows = this.makeFileRows()
    return html`
      <div
        class="${styles.container} editableFileTable-container"
        ondrop="${onFileDrop}"
        ondragover="${preventDefault}"
        ondragenter="${preventDefault}"
        ondragleave="${preventDefault}"
      >
        <table class="${styles.fileTable} EditableFileTable-container">
          <thead>
            <tr>
              <th style="width: 350px;">
                <div class="${styles.headerHolder} EditableFileTable-headerHolder">
                  Name
                  ${children.sortFileButton.render({ children: state.sortNameReversed ? 'upArrow' : 'downArrow' })}
                </div>
              </th>
              <th style="width: 99px;">
                <div class="${styles.headerHolder} EditableFileTable-headerHolder">
                  Type
                  ${children.sortTypeButton.render({ children: state.sortTypeReversed ? 'upArrow' : 'downArrow' })}
                </div>
              </th>
              <th style="width: 99px;">
                <div class="${styles.headerHolder} EditableFileTable-headerHolder">
                  Size
                  ${children.sortSizeButton.render({ children: state.sortSizeReversed ? 'upArrow' : 'downArrow' })}
                </div>
              </th>
            </tr>
          </thead>
          <tbody style="height: ${fileRows.length ? 285 : 0}px;">
            ${fileRows.map((fileRow, index) => fileRow.render(index))}
          </tbody>
        </table>
        ${renderAddOpts(fileRows.length)}
      </div>
    `
  }
}

module.exports = EditableFileTable
