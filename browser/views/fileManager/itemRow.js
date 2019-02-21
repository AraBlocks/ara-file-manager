const ContextMenu = require('../../components/contextMenu')
const { stateManagement: k } = require('k')
const { menuHelper } = require('./util')
const { windowManagement } = require('../../lib/tools')
const FileDescriptor = require('./fileDescriptor')
const PublishedStats = require('./publishedStats')
const PurchasedStats = require('./purchasedStats')
const Nanocomponent = require('nanocomponent')
const progressBar = require('./progressBar')
const styles = require('./styles/itemRow')
const html = require('nanohtml')

class ItemRow extends Nanocomponent {
  constructor({ file, typeRow }) {
    super()
    this.props = { typeRow, ...file }
    this.state = {
      contextMenuVisible: false,
      contextMenuTop: 0,
      contextMenuLeft: 0
    }
    this.children = {
      contextMenu: new ContextMenu({
        ...menuHelper({ ...file }),
        closeContextMenu: this.closeContextMenu.bind(this)
      }),
      fileDescriptor: new FileDescriptor({ ...file }),
      stats: typeRow === 'published' ? new PublishedStats({ file }) : new PurchasedStats
    }
    this.onClick = this.onClick.bind(this)
    this.rerender = this.rerender.bind(this)
    this.closeContextMenu = this.closeContextMenu.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  closeContextMenu() {
    this.state.contextMenuVisible = false
    this.rerender()
  }

  onClick() {
    const { did, name, status } = this.props
    const load = { did, name }
    switch (status) {
      case k.AWAITING_DOWNLOAD:
        windowManagement.emit({ event: k.DOWNLOAD, load })
        break
      case k.DOWNLOADED_PUBLISHED:
        windowManagement.emit({ event: k.OPEN_AFS, load: { did, name }})
        break
      case k.DOWNLOADING:
        windowManagement.emit({ event: k.STOP_SEEDING, load: { did, name }})
        break
    }
  }

  toggleMenu(e) {
    e.stopPropagation()
    const { state } = this
    state.contextMenuLeft = e.layerX + 3 + 'px'
    state.contextMenuTop = e.layerY + 3 + 'px'
    state.contextMenuVisible = true
    this.rerender()
  }

  update(newProps) {
    Object.assign(this.props, newProps)
    return true
  }

  createElement(file, last) {
    const {
      children,
      closeContextMenu,
      onClick,
      toggleMenu,
      state,
    } = this
    return (html`
      <div
        class="${styles.mainContainer} itemRow-mainContainer"
        style="margin-bottom:${last && '25px'}"
        onclick=${onClick}
        oncontextmenu=${toggleMenu}
      >
        ${children.contextMenu.render({
          ...menuHelper(file, closeContextMenu),
          left: state.contextMenuLeft,
          top: state.contextMenuTop,
          visible: state.contextMenuVisible
        })}
        <div class="${styles.container} ItemRow-container">
          <div class="${styles.fileDescriptorHolder} ItemRow-fileDescriptorHolder">
            ${children.fileDescriptor.render({ ...file })}
          </div>
          ${children.stats.render({ ...file })}
        </div>
        ${progressBar({ ...file })}
      </div>
    `)
  }

  static generator(opts) {
    return new ItemRow(opts)
  }
}

module.exports = ItemRow.generator