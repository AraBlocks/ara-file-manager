'use strict'

const k = require('../../lib/constants/stateManagement')
const Nanocomponent = require('nanocomponent')
const ProgressBar = require('../components/progressBar')
const html = require('choo/html')

class ProgressBarView extends Nanocomponent {
  update() {
    return true
  }

  createElement() {
    const bars = [new ProgressBar, new ProgressBar, new ProgressBar]
    return html`
      <div style="
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
      ">
        ${bars[0].render({ downloadPercent: 1, status: k.DOWNLOADED_PUBLISHED, shouldBroadcast: true })}
        <br>
      </div>
    `
  }
}

module.exports = ProgressBarView