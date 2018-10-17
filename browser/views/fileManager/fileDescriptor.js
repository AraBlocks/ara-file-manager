'use strict'

const k = require('../../../lib/constants/stateManagement')
const Hamburger = require('../../components/hamburgerMenu/menu')
const styles = require('./styles/fileDescriptor')
const filesize = require('filesize')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileDescriptor extends Nanocomponent {
  constructor({
    did,
    name,
    path,
    size = 0,
  }) {
    super()

    this.props = {
      did,
      name,
      path,
      size
    }

    this.children = { hamburger: new Hamburger({}) }
    this.createSummary = this.createSummary.bind(this)
  }

  createSummary({ status, name, size, downloadPercent }) {
    const nameDiv = [ k.OUT_OF_SYNC, k.UPDATE_AVAILABLE ].includes(status)
      ? html`
        <div class="${styles.nameHolder} fileDescriptor-nameHolder">
          <div class="${styles.name} fileDescriptor-name">
            ${[html`<span class="${styles.exclamation} fileDescriptor-exclamation">!</span> `, ' ' + name]}
          </div>
        </div>
      `
      : html`
        <div class="${styles.nameHolder} fileDescriptor-nameHolder">
          <div class="${styles.name} fileDescriptor-name">
            ${name}
          </div>
        </div>
      `
    const sizeDiv = this.styleSize({ size, status, downloadPercent })

    return [ nameDiv, sizeDiv ]
  }

  styleSize({ size, status, downloadPercent }) {
    let spanColor
    let msg
    let unitColor
    let downloadingModifer
    switch (status) {
      case k.DOWNLOADED_PUBLISHED:
        spanColor = 'blue'
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
        spanColor = 'red'
        downloadingModifer = Math.round(filesize(downloadPercent * size).slice(0, -2)) + ' / '
        break
      case k.PAUSED:
        spanColor = 'grey'
        downloadingModifer = Math.round(filesize(downloadPercent * size).slice(0, -2)) + ' / '
        msg = '(Paused)'
      case k.UPDATE_AVAILABLE:
        spanColor = 'red'
        msg = '(Update Available)'
    }

    const [_size, unit] = filesize(size, { output: 'array' })
    const sizeSpan = html`<span style="color:var(--ara-${spanColor});">${_size}</span>`
    const unitSpan = html`<span style="color:var(--ara-${unitColor});"> ${unit.toLocaleLowerCase()}</span>`
    const msgSpan = msg ? html`<span style="color:var(--ara-${spanColor});"> ${msg}</span>` : null

    return html`
      <div class="${styles.sizeHolder} fileDescriptor-sizeHolder">
        ${[ downloadingModifer, sizeSpan, unitSpan, msgSpan ]}
      </div>
    `
  }

  update() {
    return true
  }

  createElement({ status, downloadPercent }) {
    const {
      children,
      props,
      createSummary
    } = this

    return html`
      <div class="${styles.container} fileDescriptor-container">
        <div class="${styles.hamburgerHolder} fileDescriptor-hamburgerHolder">
          <div class="${styles.hamburger} fileDescriptor-hamburger">
            ${children.hamburger.render({})}
          </div>
        </div>
        <div class="${styles.summaryHolder} fileDescriptor-summaryHolder">
          ${createSummary({
            status,
            downloadPercent,
            name: props.name,
            size: props.size
          })}
        </div>
      </div>
    `
  }
}

module.exports = FileDescriptor