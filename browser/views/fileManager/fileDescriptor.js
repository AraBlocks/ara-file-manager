'use strict'

const html = require('choo/html')
const DynamicButton = require('../../components/dynamicButton')
const ProgressRing = require('../../components/progressRing')
const styles = require('./styles/fileDescriptor')
const Tooltip = require('../../components/tooltip')
const Nanocomponent = require('nanocomponent')
const fs = require('fs')
const path = require('path');
const userHome = require('user-home')
const {shell} = require('electron')

class FileDescriptor extends Nanocomponent {
  constructor({
    demoDownload,
    downloadPercent,
    meta,
    name,
    size,
    status
  }) {
    super()

    this.props = {
      demoDownload,
      name,
      size
    }

    this.children = {
      button: new DynamicButton(this.buttonProps(status)),
      progressRing: new ProgressRing({ status, downloadPercent }),
      tooltip: new Tooltip({
        tooltipText: this.makeTooltipText(meta)
      })
    }
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
         props.onclick = this.props.demoDownload
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
        props.onclick = () => {
          const folderPath = path.join(userHome, '.ara', 'afs')
          shell.openItem(folderPath)
        }
    }
    return props
  }

  makeTooltipText(meta) {
    return html`
      <div class="${styles.tooltip} fileDescriptor-tooltip">
        <div>
          <div>
            AFS Id:
          </div>
          <div class="${styles.aid} fileDescriptor-aid">
            ${meta.aid}
          </div>
        </div>
        <div>
          First Published: <span class="${styles.published} fileDescriptor-published">${meta.datePublished}</span>
        </div>
      </div>
    `
  }

  update() {
    return true
  }

  createElement({ downloadPercent, status }) {
    const {
      children,
      props,
    } = this

    const buttonProps = this.buttonProps.bind(this)
    return html`
      <div class="${styles.container} fileDescriptor-container">
        <div class="${styles.iconHolder} fileDescriptor-iconHolder">
          ${children.progressRing.render({ downloadPercent, status })}
        </div>
        <div class="${styles.summaryHolder} fileDescriptor-summaryHolder">
          <div class="${styles.nameHolder} fileDescriptor-nameHolder">
            <div class="${styles.name} fileDescriptor-name">
              ${props.name}
            </div>
            <div class="${styles.tooltipHolder} fileDescriptor-tooltipHolder">
              ${children.tooltip.render()}
            </div>
          </div>
          <div class="${styles.sizeHolder(status)} fileDescriptor-sizeHolder">
            ${renderSize()} gb
          </div>
          <div class="${styles.buttonHolder} fileDescriptor-buttonHolder">
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

module.exports = FileDescriptor