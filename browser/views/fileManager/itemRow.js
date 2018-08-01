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
    size,
    status,
    typeRow
  }) {
    super()

    this.state = {
      downloadPercent,
      meta,
      status
    }

    const constructorArgs = { ...meta, name, status }
    this.children = {
      fileDescriptor: new FileDescriptor({
        demoDownload: this.demoDownload.bind(this),
        downloadPercent,
        meta,
        name,
        size,
        status
      }),

      stats: typeRow === 'published'
        ? new PublishedStats(constructorArgs)
        : new PurchasedStats(constructorArgs)
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

    const isSame = downloadPercent === state.downloadPercent && status === this.status
    if (!isSame) {
      Object.assign(this.state, { downloadPercent, status })
    }
    return !isSame
  }

  createElement() {
    const {
      children,
      state: { downloadPercent, status}
    } = this

    return html`
      <div class="${styles.container} ItemRow-container">
        <div class="${styles.fileDescriptorHolder} ItemRow-fileDescriptorHolder">
          ${children.fileDescriptor.render({ downloadPercent, status })}
        </div>
          ${children.stats.render({ status })}
      </div>
    `
  }
}

module.exports = ItemRow