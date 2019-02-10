'use strict'

const { stateManagement: k } = require('k')
const Nanocomponent = require('nanocomponent')
const filesize = require('filesize')
const styles = require('./styles/fileDescriptor')
const html = require('nanohtml')

class FileDescriptor extends Nanocomponent {
  constructor(opts) {
    super()
    this.props = {
      name: opts.name || opts.did.slice(0,15) + '...',
      size: opts.size
    }
    this.createSummary = this.createSummary.bind(this)
    this.rerender = this.rerender.bind(this)
  }

  createSummary({ downloadPercent, shouldBroadcast, status}) {
    const { name } = this.props
    const awaitingStatus = status === k.AWAITING_STATUS
    const nameDiv = (html`
        <div class="${styles.nameHolder} fileDescriptor-nameHolder">
          <div class="${styles.name(awaitingStatus)} ${awaitingStatus ? 'blinker' : ''} fileDescriptor-name">
            ${[k.OUT_OF_SYNC, k.UPDATE_AVAILABLE, k.UNCOMMITTED].includes(status)
              ? [html`<span class="${styles.exclamation} fileDescriptor-exclamation">!</span> `, ' ' + name]
              : name}
          </div>
        </div>
      `)
    const sizeDiv = this.styleSize({ status, downloadPercent, shouldBroadcast })
    return (html`
      <div class="${styles.summaryHolder} fileDescriptor-summaryHolder">
        ${[nameDiv, sizeDiv]}
      </div>
    `)
  }

  styleSize({ status, downloadPercent, shouldBroadcast }) {
    const { size } = this.props
    let spanColor
    let downloadedSpanColor
    let msg
    let unitColor
    switch (status) {
      case k.DOWNLOADED_PUBLISHED:
        spanColor = shouldBroadcast ? 'teal' : 'black'
        break
      case k.AWAITING_DOWNLOAD:
      case k.AWAITING_STATUS:
        spanColor = 'grey'
        unitColor = 'grey'
        break
      case k.OUT_OF_SYNC:
        spanColor = 'orange'
        msg = '(Out of Sync)'
        break
      case k.DOWNLOADING:
        downloadedSpanColor = 'orange'
        break
      case k.PAUSED:
        spanColor = 'grey'
        downloadedSpanColor = 'grey'
        msg = '(Paused)'
        break
      case k.UPDATE_AVAILABLE:
        spanColor = 'orange'
        msg = '(Update Available)'
        break
      case k.UNCOMMITTED:
        spanColor = 'orange'
        msg = '(Not Published)'
    }

    const [_size, unit] = filesize(size, { output: 'array' })
    const downloaded = Math.round(filesize(downloadPercent * size).slice(0, -2))
    const downloadedSpan = [k.DOWNLOADING, k.PAUSED].includes(status)
      ? [(html`<span style="color:var(--ara-${downloadedSpanColor});">${downloaded}</span>`), ' /']
      : null
    const sizeSpan = (html`<span style="color:var(--ara-${spanColor});"> ${_size}</span>`)
    const unitSpan = (html`<span style="color:var(--ara-${unitColor});"> ${unit.toLocaleLowerCase()}</span>`)
    const msgSpan = msg ? (html`<span style="color:var(--ara-${spanColor});"> ${msg}</span>`) : null

    return (html`
      <div class="${styles.sizeHolder} fileDescriptor-sizeHolder">
        ${[downloadedSpan, sizeSpan, unitSpan, msgSpan]}
      </div>
    `)
  }

  toggleMenu(e) {
    const { state } = this
    e.type === 'mouseleave'
      ? state.visible = false
      : state.visible = !state.visible
    state.left = e.clientX - 10  + 'px'
    this.rerender()
  }

  update(newProps) {
    this.props.name = newProps.name || this.props.name
    this.props.size = newProps.size || this.props.size
    return true
  }

  createElement(file) {
    const { createSummary, fileClicked } = this
    const { status, downloadPercent, shouldBroadcast } = file
    return (html`
      <div onclick=${fileClicked}>
        <div class="${styles.clickable} fileDescriptor-clickable">
          ${createSummary({ downloadPercent, shouldBroadcast, status })}
        </div>
      </div>
    `)
  }
}

module.exports = FileDescriptor
