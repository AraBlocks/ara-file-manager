'use strict'

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

    // this.state = {
    //   downloadPercent,
    //   meta,
    //   status,
    //   timer: false
    // }

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

  update() {
    return true
  }

  createElement({ downloadPercent, status, meta }) {
    const { children } = this

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