'use strict'

const { AWAITING_DOWNLOAD, DOWNLOADING, FEED_MANAGE_FILE } = require('../../../lib/constants/stateManagement')
const DynamicButton = require('../../components/dynamicButton')
const styles = require('./styles/publishedStats')
const windowManagement = require('../../lib/tools/windowManagement')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PublishedStats extends Nanocomponent {
  constructor({
    aid,
    name,
    price,
    status,
  }){
    super()
    this.props = {
      name,
      price,
      aid
    }
    this.children = {
      button: new DynamicButton(this.buttonProps(aid, name, price, status))
    }
  }

  buttonProps(aid, name, price, status) {
    const props = {
      cssClass : {
        name: 'smallInvisible',
        opts: { weight: 'light '}
      }
    }
    switch(status) {
      case AWAITING_DOWNLOAD:
        props.cssClass.opts.color = 'red'
        props.children = 'Download File'
        break
      case DOWNLOADING:
        props.cssClass.opts.color = 'grey'
        props.children = 'Downloading File'
        break
      default:
        props.cssClass.opts.color = 'blue'
        props.children = 'Manage File'
        props.onclick = () => {
          const load = {
            aid,
            name,
            price
          }
          windowManagement.emit({ event: FEED_MANAGE_FILE, load })
          windowManagement.openWindow('manageFileView')
        }
    }
    return props
  }

  update() {
    return true
  }

  createElement({
    earnings,
    peers,
    price,
    status
  }) {
    const {
      children,
      buttonProps,
    } = this

    return html`
      <div class="${styles.container(status)} publishedStats-container">
        <div class="${styles.price} publishedStats-price">
          ${price} Ara
        </div>
        <div class="${styles.stats} publishedStats-stats">
          <div>
            <b>Peers:</b> ${peers}
          </div>
          <div class="${styles.divider} publishedStats-divider">
            |
          </div>
          <div>
            <b>Earnings:</b> ${earnings} Ara
          </div>
        </div>
        <div class="${styles.buttonHolder} publishedStats-buttonHolder">
          ${children.button.render(buttonProps(status))}
        </div>
      </div>
    `
  }
}

module.exports = PublishedStats