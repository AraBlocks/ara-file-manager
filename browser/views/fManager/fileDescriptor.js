'use strict'

const html = require('choo/html')
const DynamicButton = require('../../components/dynamicButton')
const ProgressRing = require('../../components/progressRing')
const styles = require('./styles/fileDescriptor')
const Tooltip = require('../../components/tooltip')
const Nanocomponent = require('nanocomponent')

class FileDescription extends Nanocomponent {
  constructor({
    downloadPercent,
    name,
    size,
    status,
    meta
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
      progressRing: new ProgressRing({ status, downloadPercent }),
      tooltip: new Tooltip({
        tooltipText: this.makeTooltipText(meta)
      })
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

  makeTooltipText(meta) {
    return html`
      <div class="${styles.tooltip} tooltip">
        <div>
          <div>
            AFS Id:
          </div>
          <div class="${styles.aid} aid">
            ${meta.aid}
          </div>
        </div>
        <div>
          First Published: <span class="${styles.published} published">${meta.datePublished}</span>
        </div>
      </div>
    `
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
      <div class="${styles.container} fileDescriptor-container">
        <div class="${styles.iconHolder} iconHolder">
          ${children.progressRing.render({ downloadPercent, status })}
        </div>
        <div class="${styles.summaryHolder} summaryHolder">
          <div class="${styles.nameHolder} nameHolder">
            <div class="${styles.name}">
              ${props.name}
            </div>
            <div class="${styles.toolTipHolder}">
              ${children.tooltip.render()}
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