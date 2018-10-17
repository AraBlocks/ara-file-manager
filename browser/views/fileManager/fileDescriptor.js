'use strict'

const k = require('../../../lib/constants/stateManagement')
const Hamburger = require('../../components/hamburgerMenu/menu')
const styles = require('./styles/fileDescriptor')
const filesize = require('filesize')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileDescriptor extends Nanocomponent {
  constructor({ name, size = 0 }) {
    super()

    this.props = { name, size }
    this.children = { hamburger: new Hamburger({}) }
    this.createSummary = this.createSummary.bind(this)
  }

  createSummary({ status, downloadPercent, seeding }) {
    const { name } = this.props
    const nameDiv = html`
        <div class="${styles.nameHolder} fileDescriptor-nameHolder">
          <div class="${styles.name} fileDescriptor-name">
            ${[ k.OUT_OF_SYNC, k.UPDATE_AVAILABLE ].includes(status)
                ? [html`<span class="${styles.exclamation} fileDescriptor-exclamation">!</span> `, ' ' + name]
                : name}
          </div>
        </div>
      `
    const sizeDiv = this.styleSize({ status, downloadPercent, seeding })

    return html`
      <div class="${styles.summaryHolder} fileDescriptor-summaryHolder">
        ${[ nameDiv, sizeDiv ]}
      </div>
    `
  }

  styleSize({ status, downloadPercent, seeding }) {
    const { size } = this.props
    let spanColor
    let downloadedSpanColor
    let msg
    let unitColor
    let downloadingModifer
    switch (status) {
      case k.DOWNLOADED_PUBLISHED:
        spanColor = seeding ? 'blue' : 'black'
        break
      case k.AWAITING_DOWNLOAD:
        spanColor = 'grey'
        unitColor = 'grey'
        break
      case k.OUT_OF_SYNC:
        spanColor = 'red'
        msg = '(Out of Sync)'
        break
      case k.DOWNLOADING:
        downloadedSpanColor = 'red'
        break
      case k.PAUSED:
        spanColor = 'grey'
        downloadedSpanColor = 'grey'
        msg = '(Paused)'
        break
      case k.UPDATE_AVAILABLE:
        spanColor = 'red'
        msg = '(Update Available)'
    }

    const [_size, unit] = filesize(size, { output: 'array' })
    const downloaded = Math.round(filesize(downloadPercent * size).slice(0, -2))
    const downloadedSpan = [k.DOWNLOADING, k.PAUSED].includes(status)
      ? [ html`<span style="color:var(--ara-${downloadedSpanColor});">${downloaded}</span>`, ' /']
      : null
    const sizeSpan = html`<span style="color:var(--ara-${spanColor});"> ${_size}</span>`
    const unitSpan = html`<span style="color:var(--ara-${unitColor});"> ${unit.toLocaleLowerCase()}</span>`
    const msgSpan = msg ? html`<span style="color:var(--ara-${spanColor});"> ${msg}</span>` : null

    return html`
      <div class="${styles.sizeHolder} fileDescriptor-sizeHolder">
        ${[ downloadedSpan, sizeSpan, unitSpan, msgSpan ]}
      </div>
    `
  }

  update() {
    return true
  }

  createElement({ status, downloadPercent, seeding }) {
    const { children, createSummary } = this

    return html`
      <div class="${styles.container} fileDescriptor-container">
        <div class="${styles.hamburgerHolder} fileDescriptor-hamburgerHolder">
          <div class="${styles.hamburger} fileDescriptor-hamburger">
            ${children.hamburger.render({})}
          </div>
        </div>
        ${createSummary({
          status,
          downloadPercent,
          seeding
        })}
      </div>
    `
  }
}

module.exports = FileDescriptor