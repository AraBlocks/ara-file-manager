'use strict'

const Button = require('../components/button')
const windowManagement = require('../lib/tools/windowManagement')
const { emit } = require('../lib/tools/windowManagement')
const Input = require('../components/input')
const overlay = require('../components/overlay')
const UtilityButton = require('../components/utilityButton')
const styles = require('./styles/sendAra')
const k = require('../../lib/constants/stateManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class SendAra extends Nanocomponent {
  constructor() {
    super()

    this.state = { walletAddress : '', amount: null }

    this.children = {
			closeButton: new UtilityButton({ children: 'close' }),

      walletAddressInput: new Input({
        placeholder: 'Wallet Address',
        parentState: this.state,
        field: 'walletAddress'
			}),

			amountInput: new Input({
        placeholder: '0.0',
        parentState: this.state,
				field: 'amount',
				type: 'number',
				embeddedButton: {
					option: 'selection',
					optionList: [
						'ARA',
					],
					field: 'currency'
				}
      }),

      sendButton: new Button({
        children: 'Send Tokens',
        type: 'submit'
      })
    }

    this.sendAra = this.sendAra.bind(this)
    this.render = this.render.bind(this)
  }

  sendAra(e) {
		e.preventDefault()
		emit({ event: k.SEND_ARA, load: this.state })
		windowManagement.closeWindow('sendAra')
  }

  update() {
    return true
  }

  createElement() {
    const { children, sendAra } = this
    return html`
      <div class="modal">
				${overlay(false)}
				<div class=${styles.header}>
					Send Tokens
					${children.closeButton.render({children: 'close' })}
				</div>
        <p class=${styles.description}>
					Send tokens from your wallet to another user’s account. You will need that user’s <b>Wallet Address</b>.
				</p>
				<div class=${styles.divider}></div>
        <form class=${styles.sendAraForm} onsubmit=${sendAra}>
					${children.walletAddressInput.render({})}
					${children.amountInput.render({})}
          ${children.sendButton.render({})}
        </form>
      </div>
    `
  }
}

module.exports = SendAra