'use strict'

const DynamicButton = require('../../components/dynamicButton')
const styles = require('./styles/publishedStats')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PublishedStats extends Nanocomponent {
  constructor({
    earnings = null,
    peers = null,
    price = null,
    status
  }){
    super()

    this.state = {
      earnings,
      peers,
      price,
      status
    }

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
      case 0:
        props.cssClass.opts.color = 'red'
        props.children = 'Download File'
        break
      case 1:
        props.cssClass.opts.color = 'grey'
        props.children = 'Downloading File'
        break
      default:
        props.cssClass.opts.color = 'blue'
        props.children = 'Manage File'
    }
    return props
  }

  update({ status }) {
    const { state } = this
    const sameStatus = state.status === status
    if (!sameStatus){ state.status = status }
    return !sameStatus
  }

  createElement() {
    const {
      children,
      buttonProps,
      state
    } = this

    return html`
      <div class="${styles.container(state.status)} publishedStats-container">
        <div class="${styles.price} publishedStats-price">
          ${state.price} ARA
        </div>
        <div class="${styles.stats} publishedStats-stats">
          <div>
            <b>Peers:</b> ${state.peers}
          </div>
          <div class="${styles.divider} publishedStats-divider">
            |
          </div>
          <div>
            <b>Earnings:</b> ${state.earnings} ARA
          </div>
        </div>
        <div class="${styles.buttonHolder} publishedStats-buttonHolder">
          ${children.button.render(buttonProps(state.status))}
        </div>
      </div>
    `
  }
}

module.exports = PublishedStats