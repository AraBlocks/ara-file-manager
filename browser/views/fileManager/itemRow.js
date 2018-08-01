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
        demoDownload: this.demoDownload.bind(this),
        downloadPercent,
        meta,
        name,
        size,
        status
      }),

      stats: typeRow === 'published'
        ? new PublishedStats({ ...meta, status })
        : new PurchasedStats({ ...meta, status })
    }

    this.demoDownload = this.demoDownload.bind(this)
  }

  demoDownload() {
    const { state } = this
    state.status = 1
    state.timer = setInterval(() => {
      state.downloadPercent = state.downloadPercent += .12
      if (state.downloadPercent >= .999) {
        state.downloadPercent = 1
        state.status = 2
        this.rerender()
        clearInterval(state.timer)
        emit({ event: DOWNLOADED_DEV })
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
      demoDownload,
      props: { typeRow },
      state: { downloadPercent, status }
    } = this

    typeRow === 'purchased'
    && !this.state.timer
    && status !== 2
    && setTimeout(demoDownload, 1500)

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