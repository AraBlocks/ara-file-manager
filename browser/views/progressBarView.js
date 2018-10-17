'use strict'

const k = require('../../lib/constants/stateManagement')
const Nanocomponent = require('nanocomponent')
const ProgressBar = require('../components/progressBar')
const html = require('choo/html')

class ProgressBarView extends Nanocomponent {
  constructor() {
    super()
    this.state = {
      downloadPercent: 0,
      shouldBroadcast: false,
      status: k.AWAITING_DOWNLOAD
    }
    this.timer = null
    this.animate = this.animate.bind(this)
  }

  animate() {
    if (this.timer) return
    this.timer = setInterval(() => {
      this.state.downloadPercent += (Math.random() * 1) * .1
      if (this.state.downloadPercent >= 1) {
        clearInterval(this.timer)
        this.state.downloadPercent = 1
        this.state.shouldBroadcast = true
        this.state.status = k.DOWNLOADED_PUBLISHED
      }
      this.rerender()
    }, 1000)
  }

  update() {
    return true
  }

  createElement() {
    const { animate } = this
    const animationBar = new ProgressBar
    return html`
      <div style="
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
      ">
        DOWNLOADED/PUBLISHED & BROADCASTING
        ${new ProgressBar().render({ downloadPercent: 1, status: k.DOWNLOADED_PUBLISHED, shouldBroadcast: true })}
        <br>
        DOWNLOADING
        ${new ProgressBar().render({ downloadPercent: .5, status: k.DOWNLOADING, shouldBroadcast: false })}
        <br>
        OUT OF SYNC
        ${new ProgressBar().render({ downloadPercent: 1, status: k.OUT_OF_SYNC, shouldBroadcast: false })}
        <br>
        PAUSED
        ${new ProgressBar().render({ downloadPercent: .6, status: k.PAUSED, shouldBroadcast: false })}
        <br>
        AWAITING DOWNLOAD
        ${new ProgressBar().render({ downloadPercent: 0, status: k.AWAITING_DOWNLOAD, shouldBroadcast: false })}
        <br>
        UPDATE AVAILABLE
        ${new ProgressBar().render({ downloadPercent: 1, status: k.UPDATE_AVAILABLE, shouldBroadcast: false })}
        <br>
        <span onclick=${animate}>▶</span>
        ${animationBar.render(this.state)}
      </div>
    `
  }
}

module.exports = ProgressBarView