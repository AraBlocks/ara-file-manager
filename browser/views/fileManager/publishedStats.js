'use strict'

const { AWAITING_DOWNLOAD, DOWNLOADING } = require('../../../lib/constants/stateManagement')
const DynamicButton = require('../../components/dynamicButton')
const styles = require('./styles/publishedStats')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PublishedStats extends Nanocomponent {
  constructor({ status }){
    super()

    this.children = {
      button: new DynamicButton(this.buttonProps(status))
    }
  }

  buttonProps(status) {
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