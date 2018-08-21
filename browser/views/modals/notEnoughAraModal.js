'use strict'

const html = require('choo/html')
const styles = require('./styles')
const Button = require('../../components/button')
const { closeWindow } = require('../../lib/tools/windowManagement')

module.exports = () => {
  const confirmButton = new Button({
		children: 'Confirm',
		onclick: () => closeWindow()
	})
  return html`
    <div class="${styles.container} modals-container">
      <div class="${styles.messageBold} modal-messageBold">
			Not enough ARA
      </div>
			<div class="${styles.smallMessage} modal-smallMessage">
				You do not have enough ARA Tokens to complete<br>
				this transaction.
			</div>
      <div>
        ${confirmButton.render()}
      </div>
    </div>
  `
}