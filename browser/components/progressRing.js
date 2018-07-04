'use strict'

const styles = require('./styles/progressRing')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class ProgressRing extends Nanocomponent {
  constructor({
    parentRender,
    parentState,
    status,
  }){
    super()

    this.props = {
      parentRender,
      parentState
    }

    this.state = {
      mockPercent: 0,
      status,
      timer: null
    }
  }

  update({ downloadPercent }) {
    const { state }  = this

    if (downloadPercent >= .99) {
      state.status = 2
      clearInterval(state.timer)
      state.timer = null
    }
    return true
  }

  load() {
    const { state, props } = this

    if (state.status === 1 && state.timer === null) {
      state.timer = setInterval(()=> {
        state.mockPercent = state.mockPercent >= 1 ? 0 : state.mockPercent
        props.parentState.downloadPercent = state.mockPercent
        props.parentRender()
        this.render({ downloadPercent: state.mockPercent += .1 })
      }, 1000)
    }
  }

  createElement({ downloadPercent }) {
    const { state } = this

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
            fill="${styles.colorSelector(state.status)}"
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
            stroke="${styles.colorSelector(state.status)}"
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
      switch (state.status) {
        case 0 :
          symbol = '✖'
          break
        case 1 :
          symbol = '⬇'
          break
        default :
          symbol = '⬆'
      }
      return symbol
    }
  }
}

module.exports = ProgressRing