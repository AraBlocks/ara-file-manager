'use strict'

const DynamicButton = require('../../components/dynamicButton')
const { openFolder } = require('../../lib/tools/windowManagement')
const ProgressRing = require('../../components/progressRing')
const styles = require('./styles/fileDescriptor')
const Tooltip = require('../../components/tooltip')
const filesize = require('filesize')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileDescriptor extends Nanocomponent {
  constructor({
    downloadPercent,
    meta,
    name,
    path,
    size,
    status
  }) {
    super()

    this.props = {
      meta,
      name,
      path,
      size
    }

    this.children = {
      button: new DynamicButton(this.buttonProps(status)),
      progressRing: new ProgressRing({ status, downloadPercent }),
      tooltip: new Tooltip({
        id: meta.aid,
        component: 'fileTooltip',
        args: { meta, name }
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
         break
      case 1:
         props.children = 'Cancel Download'
         props.cssClass = {
           name: 'smallInvisible',
           opts: { color: 'grey' }
         }
         props.onclick = () => console.log('downloading')
         break
      case 3:
        props.children = 'Cancel Publish'
        props.cssClass = {
          name: 'smallInvisible',
          opts: { color: 'grey' }
        }
        props.onclick = () => console.log('downloading')
        break
      case 4:
        props.children = 'Download Failed'
        props.cssClass = {
          name: 'smallInvisible',
          opts: { color: 'red' }
        }
        props.onclick = () => console.log('download failed')
        break
      default:
        props.children = 'Open in Folder'
        props.cssClass = {
          name: 'smallInvisible',
          opts: { color: 'blue' }
        }
        props.onclick = () => {
          openFolder(this.props.path)
        }
    }
    return props
  }

  update() {
    return true
  }

  createElement({ downloadPercent, status }) {
    const {
      children,
      props
    } = this
    const buttonProps = this.buttonProps.bind(this)

    return html`
      <div class="${styles.container} fileDescriptor-container">
        <div class="${styles.iconHolder} fileDescriptor-iconHolder">
          ${
            status === 3
              ? html`<div class="spinner-small-blue"></div>`
              : children.progressRing.render({ downloadPercent, status })
          }
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
            ${renderSize()}
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
          text = filesize(props.size)
          break
        default:
          text = `${Math.round(downloadPercent * props.size * 100) / 100}/${filesize(props.size)}`
      }
      return text
    }
  }
}

module.exports = FileDescriptor