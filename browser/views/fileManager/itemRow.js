'use strict'

const { DOWNLOADED_DEV } = require('../../../lib/constants/stateManagement')
const { emit } = require('../../lib/tools/windowManagement')
const FileDescriptor = require('./fileDescriptor')
const PublishedStats = require('./publishedStats')
const PurchasedStats = require('./purchasedStats')
const styles = require('./styles/itemRow')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class ItemRow extends Nanocomponent {
  constructor({
    downloadPercent,
    name,
    meta,
    path,
    size,
    status,
    typeRow
  }) {
    super()

    this.state = {
      downloadPercent,
      meta,
      status,
      timer: false
    }

    this.props = { typeRow }

    this.children = {
      fileDescriptor: new FileDescriptor({
        downloadPercent,
        meta,
        name,
        path,
        size,
        status
      }),

      stats: typeRow === 'published'
        ? new PublishedStats({ ...meta, name, status })
        : new PurchasedStats({ ...meta, name, status })
    }
  }

  update({ downloadPercent, status }) {
    const { state } = this
    const isSame = downloadPercent === state.downloadPercent && status === this.status
    if (!isSame) {
      Object.assign(this.state, { downloadPercent, status })
    }
    return !isSame
  }

  createElement({ fileInfo }) {
    const {
      children,
    } = this

    const {
      downloadPercent,
      status,
      meta
    } = fileInfo

    return html`
      <div class="${styles.container} ItemRow-container">
        <div class="${styles.fileDescriptorHolder} ItemRow-fileDescriptorHolder">
          ${children.fileDescriptor.render({ downloadPercent, status })}
        </div>
          ${children.stats.render({ ...meta })}
      </div>
    `
  }
}

module.exports = ItemRow