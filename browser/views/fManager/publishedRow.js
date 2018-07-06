'use strict'

const FileDescriptor = require('./fileDescriptor')
const html = require('choo/html')
const PublishedStats = require('./publishedStats')
const styles = require('./styles/publishedRow')
const Nanocomponent = require('nanocomponent')

class PublishedRow extends Nanocomponent {
  constructor({
    downloadPercent,
    name,
    meta,
    size,
    status,
    percentDownloaded
  }) {
    super()

    this.state = {
      meta,
      status,
      percentDownloaded
    }

    this.children = {
      fileDescriptor: new FileDescriptor({
        downloadPercent,
        meta,
        name,
        size,
        status
      }),

      publishedStats: new PublishedStats({
        ...meta,
        status
      })
    }
  }

  update() {
    return true
  }

  createElement() {
    const { children } = this
    return html`
      <div class="${styles.container} publishedRow-container">
        <div class="${styles.fileDescriptorHolder} publishedRow-fileDescriptorHolder">
          ${children.fileDescriptor.render()}
        </div>
        <div class="${styles.publishedStatsHolder} publishedRow-publishedStatsHolder">
          ${children.publishedStats.render()}
        </div>
      </div>
    `
  }
}
module.exports = PublishedRow