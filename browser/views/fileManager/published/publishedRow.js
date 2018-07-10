'use strict'

const FileDescriptor = require('../fileDescriptor')
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
    this.rerender()
    state.timer = setInterval(() => {
      state.downloadPercent = state.downloadPercent += .12
      if (state.downloadPercent >= .999) {
        state.downloadPercent = 1
        state.status = 2
        this.rerender()
        clearInterval(state.timer)
      }
      this.rerender()
    }, 1000)
  }

  update({ downloadPercent, status }) {
    const { state } = this
    if (downloadPercent !== state.downloadPercent || status !== this.status) {
      Object.assign(this.state, { downloadPercent, status })
      return true
    }
    return false
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