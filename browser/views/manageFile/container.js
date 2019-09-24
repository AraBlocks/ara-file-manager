const Button = require('../../components/button')
const { clipboard } = require('electron')
const { fileSystemManager, windowManagement } = require('../../lib/tools')
const DynamicTooltip = require('../../components/dynamicTooltip')
const FileInfo = require('./fileInfo')
const overlay = require('../../components/overlay')
const { events } = require('k')
const styles = require('./styles/container')
const UtilityButton = require('../../components/utilityButton')
const filesize = require('filesize')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class Container extends Nanocomponent {
  constructor(opts) {
    super()
    this.props = { account: opts.account }
    this.state = {
      afsContents: opts.fileList,
      did: opts.did,
      name: opts.name,
      fileList: opts.fileList,
      oldName: opts.name,
      oldPrice: opts.price,
      price: opts.price || '',
      uncommitted: opts.uncommitted
    }
    this.children = {
      fileInfo: new FileInfo({
        addItems: this.addItems.bind(this),
        did: opts.did,
        parentState: this.state,
        renderView: this.renderView.bind(this),
        oninput: this.oninput.bind(this)
      }),
      packageIDTooltip: new DynamicTooltip({
        onclick: () => clipboard.writeText(opts.did)
      }),
      publishButton: new Button({
        children: this.state.uncommitted ? 'Publish' : 'Publish Update',
        cssClass: { name: 'thinBorder' },
        onclick: this.updateFile.bind(this)
      })
    }
  }

  addItems(items) {
    const itemsInfo = items.map(fileSystemManager.getFileInfo)
    this.state.fileList.push(...itemsInfo)
    this.rerender()
  }

  closeWindow() {
    if (this.state.uncommitted === false) {
      windowManagement.emit({ event: events.START_SEEDING, load: { did: this.state.did } })
    }
    windowManagement.closeWindow('manageFileView')
    windowManagement.emit({ event: events.CHANGE_PENDING_PUBLISH_STATE, load: false })
  }

  get fileInfoChanged() {
    const { state } = this
    const { addPaths, removePaths } = this.pathDiff

    const priceChanged = state.oldPrice !== state.price
    const shouldCommit = !(addPaths.length === 0 && removePaths.length === 0)
    const notEmpty = state.fileList.length !== 0

    return (priceChanged || shouldCommit) && notEmpty && state.price >= 0
  }

  get nameChanged() {
    return this.state.oldName !== this.state.name
  }

  oninput(key) {
    return (value) => {
      this.state[key] = value
      this.rerender()
    }
  }

  get somethingChanged() {
    return this.nameChanged && !this.state.uncommitted || this.fileInfoChanged
  }

  renderView() {
    this.render({})
  }

  get pathDiff() {
    const { state } = this
    const subPaths = state.fileList.map(file => file.subPath)
    const removePaths = state.afsContents.filter(file =>
      !subPaths.includes(file.subPath) && file.fullPath === null
    ).map(file => file.subPath)
    const addPaths = state.fileList.filter(file =>
      file.fullPath != null
    ).map(file => file.fullPath)
    const allPaths = state.fileList.map(file => file.fullPath)
    return {
      addPaths,
      allPaths,
      removePaths
    }
  }

  updateFile() {
    const { state } = this
    const {
      addPaths,
      allPaths,
      removePaths
    } = this.pathDiff

    const load = {
      addPaths,
      did: state.did,
      name: state.name,
      paths: allPaths,
      password: account.password,
      removePaths,
      size: state.fileList.reduce((sum, file) => sum += file.size, 0),
      shouldCommit: !(addPaths.length === 0 && removePaths.length === 0),
      shouldUpdatePrice: state.oldPrice != state.price,
      price: state.price || 0,
      userDID: account.userDID
    }
    if (this.fileInfoChanged && state.uncommitted) {
      windowManagement.emit({ event: events.PUBLISH, load })
    } else if (this.fileInfoChanged) {
      windowManagement.emit({ event: events.UPDATE_FILE, load })
    } else if (this.nameChanged && !state.uncommitted) {
      windowManagement.emit({ event: events.UPDATE_META, load: { did: load.did, name: load.name } })
    }
  }

  renderDescription() {
    const { state } = this
    const manageFileText = (html`
      <div class="${styles.descriptionHolder} manageFileContainer-descriptionHolder">
        <div>
          This package has been published to the Ara Network. You can edit and update the package here. The changes will be
          pushed to all users on the network.
        </div>
        <div>
          <b>Note:</b> Ara is a decentralized network. at least one computer must be connected and hosting this file for
          users
          to be able to download it.
        </div>
      </div>
    `)
    const publishFileText = (html`
      <div class="${styles.descriptionHolder} manageFileContainer-descriptionHolder">
        <div>
          Publish your package for distribution on the Ara Network. You can publish a single file or an entire directory as a
          single
          asset. Once published, use the provided distribution link to allow users to purchase your package.
        </div>
        <div>
          <b>Note:</b> Ara is a decentralized network. at least one computer must be connected and hosting this file for
          users
          to be able to download it.
        </div>
      </div>
    `)
    return state.uncommitted ? publishFileText : manageFileText
  }

  get publishBtnAttributes() {
    const attributes = {}
    attributes.cssClass = this.somethingChanged ? { name: 'standard' } : { name: 'thinBorder' }

    if (this.fileInfoChanged) {
      const span = (html`
        <span style="font-family: ProximaNova-light;">
          (${ filesize(this.state.fileList.reduce((sum, file) => sum += file.size, 0))})
        </span>
      `)
      attributes.children = ['Publish', span]
    }
    return attributes
  }

  update({ fileList, price }) {
    const { state } = this
    if (fileList != null && state.afsContents.length === 0) {
      state.fileList = fileList
      state.afsContents = fileList
    }
    if (price) {
      state.oldPrice = price
      state.price = price
    }
    return true
  }

  createElement({ spinner = false }) {
    const { children, state, publishBtnAttributes } = this
    return (html`
      <div class="${styles.container} ManageFileContainer-container">
        ${overlay(spinner)}
        <div class="${styles.horizontalContainer} ${styles.title} ManageFileContainer-horizontalContainer,title">
          ${state.uncommitted ? 'Publish Package' : 'Manage Package'}
        </div>
        <div class="${styles.content} ManageFileContainer-content">
          ${this.renderDescription()}
        </div>
        ${state.uncommitted ? null : children.packageIDTooltip.render({ children: "Package ID: " + state.did })}
        <div class="${styles.divider} ManageFileContainer-divider"></div>
        ${children.fileInfo.render({ parentState: state })}
        ${children.publishButton.render(publishBtnAttributes)}
      </div>
    `)
  }
}

module.exports = Container
