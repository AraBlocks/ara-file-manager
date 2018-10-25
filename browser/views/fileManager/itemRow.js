'use strict'

const FileDescriptor = require('./fileDescriptor')
const ProgressBar = require('../../components/progressBar')
const PublishedStats = require('./publishedStats')
const PurchasedStats = require('./purchasedStats')
const styles = require('./styles/itemRow')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class ItemRow extends Nanocomponent {
  constructor({ file, typeRow }) {
    super()
    const {
      downloadPercent,
      status,
      shouldBroadcast
    } = file

    this.state = {
      downloadPercent,
      status,
      shouldBroadcast
    }
    this.props = { typeRow }
    this.children = {
      fileDescriptor: new FileDescriptor({ ...file }),
      progressBar: new ProgressBar,
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
        ${children.progressBar.render(file)}
      </div>
    `
  }
}

module.exports = ItemRow