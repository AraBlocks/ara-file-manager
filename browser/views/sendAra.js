const Button = require('../components/button')
const windowManagement = require('../lib/tools/windowManagement')
const { emit } = require('../lib/tools/windowManagement')
const Input = require('../components/input')
const overlay = require('../components/overlay')
const UtilityButton = require('../components/utilityButton')
const styles = require('./styles/sendAra')
const { events } = require('k')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class SendAra extends Nanocomponent {
  constructor() {
    super()

    this.state = { receiver : '', amount: '' }

    this.children = {
      closeButton: new UtilityButton({ children: 'close' }),
      sendButton: new Button({ children: 'Send Tokens', type: 'submit' }),
      amountInput: new Input({
        araIcon: true,
        oninput: this.oninput('amount'),
        placeholder: '0.0',
        type: 'number',
        step: 'any',
        value: this.state.amount
      }),
      receiverInput: new Input({
        oninput: this.oninput('receiver'),
        placeholder: 'Wallet Address or Ara ID',
        value: this.state.receiver
			}),
    }

    this.sendAra = this.sendAra.bind(this)
    this.render = this.render.bind(this)
  }

  oninput(key) {
    return (value) => {
      this.state[key] = value
      this.rerender()
    }
  }

  sendAra(e) {
		e.preventDefault()
		emit({ event: events.SEND_ARA, load: this.state })
		windowManagement.closeWindow('sendAra')
  }

  update() {
    return true
  }

  createElement() {
    const { children, sendAra, state } = this
    return (html`
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
					${children.receiverInput.render({ value: state.receiver })}
					${children.amountInput.render({ value: state.amount })}
          ${children.sendButton.render({})}
        </form>
      </div>
    `)
  }
}

module.exports = SendAra