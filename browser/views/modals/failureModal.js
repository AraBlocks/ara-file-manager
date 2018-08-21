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
				Something went wrong
      </div>
			<div class="${styles.smallMessage} modal-smallMessage">
				This transaction could not be completed.
				It could be that the link is no longer valid, or that there are no peers sharing this file right now.
			</div>
      <div>
        ${confirmButton.render()}
      </div>
    </div>
  `
}