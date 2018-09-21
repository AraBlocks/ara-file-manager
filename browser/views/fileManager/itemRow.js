'use strict'

const FileDescriptor = require('./fileDescriptor')
const PublishedStats = require('./publishedStats')
const PurchasedStats = require('./purchasedStats')
const styles = require('./styles/itemRow')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class ItemRow extends Nanocomponent {
  constructor({ file, typeRow }) {
    super()

    this.props = { typeRow }
    this.children = {
      fileDescriptor: new FileDescriptor({ ...file }),
      stats: typeRow === 'published'
        ? new PublishedStats({ file })
        : new PurchasedStats()
    }
  }

  update() {
    return true
  }

  createElement(file) {
    const { downloadPercent, status } = file
    const { children } = this
    return html`
      <div class="${styles.container} ItemRow-container">
        <div class="${styles.fileDescriptorHolder} ItemRow-fileDescriptorHolder">
          ${children.fileDescriptor.render({ downloadPercent, status })}
        </div>
        ${children.stats.render({ ...file })}
      </div>
    `
  }
}

module.exports = ItemRow