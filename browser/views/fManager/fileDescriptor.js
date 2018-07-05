'use strict'

const html = require('choo/html')
const DynamicButton = require('../../components/dynamicButton')
const ProgressRing = require('../../components/progressRing')
const styles = require('./styles.js/fileDescriptor')
const Nanocomponent = require('nanocomponent')

class FileDescription extends Nanocomponent {
  constructor({
    downloadPercent,
    name,
    size,
    status
  }) {
    super()

    this.props = {
      name,
      size
    }

    this.state = {
      downloadPercent,
      status,
      timer: null
    }

    this.children = {
      button: new DynamicButton(this.buttonProps(status)),
      progressRing: new ProgressRing({ status, downloadPercent })
    }
  }

  start() {
    const { state } = this
    state.timer = setInterval(() => {
      state.downloadPercent = state.downloadPercent += .1
      if (state.downloadPercent >= 1) {
        state.downloadPercent = 1
        state.status = 2
        clearInterval(state.timer)
      }
      this.rerender()
    }, 1000)
  }

  buttonProps(status) {
    const props = {}
    switch(status) {
      case 0:
        props.children = 'Download File'
        props.cssClass = {
          name: 'smallInvisible',
          opts: { color: 'red' }
         }
         props.onclick = () => console.log('undownloaded')
         break
      case 1:
         props.children = 'Cancel Download'
         props.cssClass = {
           name: 'smallInvisible',
           opts: { color: 'grey' }
         }
         props.onclick = () => console.log('downloading')
         break
      default:
        props.children = 'Open in Folder'
        props.cssClass = {
          name: 'smallInvisible',
          opts: { color: 'blue' }
        }
        props.onclick = () => console.log('downloaded')
    }
    return props
  }

  update() {
    return true
  }

  createElement() {
    const {
      children,
      buttonProps,
      props,
      state: { downloadPercent, status }
    } = this

    return html`
      <div class="${styles.container}">
        <div class="${styles.iconHolder} iconHolder">
          ${children.progressRing.render({ downloadPercent, status })}
        </div>
        <div class="${styles.summaryHolder} summaryHolder">
          <div class="${styles.nameHolder} nameHolder">
            <div class="${styles.name}">
              ${props.name}
            </div>
            <div class="${styles.toolTipHolder}">
              <div class="${styles.tempToolTip} tempToolTip"></div>
            </div>
          </div>
          <div class="${styles.sizeHolder(status)} sizeHolder">
            ${renderSize()} gb
          </div>
          <div class="${styles.buttonHolder} buttonHolder">
            ${children.button.render(buttonProps(status))}
          </div>
        </div>
      </div>
    `

    function renderSize() {
      let text
      switch(status) {
        case 0:
        case 2:
          text = props.size
          break
        default:
          text = `${Math.round(downloadPercent * props.size * 100) / 100}/${props.size}`
      }
      return text
    }
  }
}

module.exports = FileDescription