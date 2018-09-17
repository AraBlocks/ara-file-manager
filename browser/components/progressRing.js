'use strict'

const {
  AWAITING_DOWNLOAD,
  DOWNLOADING,
  DOWNLOAD_FAILED
} = require('../../lib/constants/stateManagement')
const styles = require('./styles/progressRing')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class ProgressRing extends Nanocomponent {

  update() {
    return true
  }

  createElement({ downloadPercent, status }) {
    return html`
      <div class="${styles.container}">
        <svg
          class="progress-ring"
          width="20"
          height="20"
        >
          ${underCircle()}
          ${overCircle()}
          <text
            x="50%"
            y="53%"
            alignment-baseline="middle"
            text-anchor="middle"
            fill="${styles.colorSelector(status)}"
            font-size="8"
            font-family="Verdana"
          >
            ${symbolSelector()}
          </text>
        </svg>
      </div>
    `

    function underCircle() {
      const circle = html`
        <circle
          class="${styles.progressRing}"
          stroke="${styles.colors.araGrey}"
          stroke-width="2"
          fill="transparent"
          r="6"
          cx="10"
          cy="10"
        />
      `
      return paintRing(circle, 1)
    }

    function overCircle() {
        const circle = html`
          <circle
            class="${styles.progressRing}"
            stroke="${styles.colorSelector(status)}"
            stroke-width="2"
            fill="transparent"
            r="6"
            cx="10"
            cy="10"
          />
        `
      return paintRing(circle, downloadPercent)
    }

    function paintRing(circle, percent) {
      const radius = circle.r.baseVal.value
      const circumference = radius * 2 * Math.PI
      circle.style.strokeDasharray = `${circumference} ${circumference}`
      circle.style.strokeDashoffset = circumference
      const offset = circumference - percent * circumference
      circle.style.strokeDashoffset = offset
      return circle
    }

    function symbolSelector() {
      let symbol
      switch (status) {
        case AWAITING_DOWNLOAD:
          symbol = '✖'
          break
        case DOWNLOADING:
        case DOWNLOAD_FAILED:
          symbol = '⬇'
          break
        default:
          symbol = '⬆'
      }
      return symbol
    }
  }
}

module.exports = ProgressRing