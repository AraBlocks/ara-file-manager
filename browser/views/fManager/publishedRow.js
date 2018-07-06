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
  }) {
    super()

    this.state = {
      downloadPercent,
      meta,
      status
    }

    this.children = {
      fileDescriptor: new FileDescriptor({
        demoDownload: this.demoDownload.bind(this),
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

  demoDownload() {
    const { state } = this

    state.status = 1
    state.timer = setInterval(() => {
      state.downloadPercent = state.downloadPercent += .1
      if (state.downloadPercent >= 1) {
        state.downloadPercent = 1
        state.status = 2
        clearInterval(state.timer)
      }
      this.rerender()
    }, 1000)
  }

  update() {
    return true
  }

  createElement() {
    const {
      children,
      state: { downloadPercent, status}
     } = this
    return html`
      <div class="${styles.container} publishedRow-container">
        <div class="${styles.fileDescriptorHolder} publishedRow-fileDescriptorHolder">
          ${children.fileDescriptor.render({ downloadPercent, status })}
        </div>
        <div class="${styles.publishedStatsHolder} publishedRow-publishedStatsHolder">
          ${children.publishedStats.render({ status })}
        </div>
      </div>
    `
  }
}
module.exports = PublishedRow