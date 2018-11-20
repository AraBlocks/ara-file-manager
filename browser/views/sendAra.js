'use strict'

const Button = require('../components/button')
const windowManagement = require('../lib/tools/windowManagement')
const { emit } = require('../lib/tools/windowManagement')
const Input = require('../components/input')
const overlay = require('../components/overlay')
const styles = require('./styles/sendAra')
const k = require('../../lib/constants/stateManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class SendAra extends Nanocomponent {
  constructor() {
    super()

    this.state = { walletAddress : '' }

    this.children = {
      walletAddressInput: new Input({
        placeholder: 'Wallet Address',
        parentState: this.state,
        field: 'walletAddress'
			}),

			amountInput: new Input({
        placeholder: 0.0,
        parentState: this.state,
				field: 'walletAddress',
				type: 'number'
      }),

      submitButton: new Button({
        children: 'Send Tokens',
        type: 'submit'
      })
    }

    this.register = this.register.bind(this)
    this.render = this.render.bind(this)
  }

  register(e) {
    e.preventDefault()
    const { password } = this.state
    emit({ event: k.REGISTER, load: password })
  }

  update() {
    return true
  }

  createElement() {
    const { children, register } = this
    return html`
      <div class="modal">
        ${overlay(false)}
				<div class=${styles.header}>
					Send Tokens
				</div>
        <p class=${styles.description}>
					Send tokens from your wallet to another user’s account. You will need that user’s <b>Wallet Address</b>.
				</p>
				<div class=${styles.divider}></div>
        <form class=${styles.sendAraForm} onsubmit=${register}>
					${children.walletAddressInput.render({})}
					${children.amountInput.render({})}
          ${children.submitButton.render({})}
        </form>
      </div>
    `
  }
}

module.exports = SendAra