'use strict'

const styles = require('./styles/purchasedStats')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PurchasedStats extends Nanocomponent {
  constructor({
    earnings,
    peers,
    status
   }) {
    super()

    this.state = {
      earnings,
      peers,
      status
     }
}

  update(){
    return true
}

  createElement() {
    const { state } = this
    return html`
    `
  }
}

module.exports = PurchasedStats