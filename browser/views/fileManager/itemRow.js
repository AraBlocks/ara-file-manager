'use strict'

const FileDescriptor = require('./fileDescriptor')
const progressBar = require('./progressBar')
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
        : new PurchasedStats
    }
  }

  update() {
    return true
  }

  createElement(file) {
    const { downloadPercent, status, shouldBroadcast } = file
    const { children } = this

    return html`
      <div>
        <div class="${styles.container} ItemRow-container">
          <div class="${styles.fileDescriptorHolder} ItemRow-fileDescriptorHolder">
            ${children.fileDescriptor.render({ downloadPercent, status, shouldBroadcast })}
          </div>
          ${children.stats.render({ ...file })}
        </div>
        ${progressBar({ downloadPercent, status, shouldBroadcast })}
      </div>
    `
  }
}

module.exports = ItemRow