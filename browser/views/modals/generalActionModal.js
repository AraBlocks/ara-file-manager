'use strict'

const Button = require('../../components/button')
const { actionModalText } = require('../../lib/tools/generalModalTextProvider')
const { closeModal } = require('../../lib/tools/windowManagement')
const html = require('nanohtml')
const styles = require('./styles')

module.exports = ({
  modalName = 'quitConfirm',
  callback = () => {}
}) => {
  const confirmButton = new Button({
		children: 'Confirm',
		onclick: () => {
      callback()
      closeModal('generalActionModal')
    }
	})
	const cancelButton = new Button({
		children: 'Cancel',
		...styles.buttonSelector('cancel'),
		onclick: () => {
      closeModal('generalActionModal')
    }
	})
	const { title, description } = actionModalText(modalName)
	return html`
    <div class="${styles.container({})} modals-container">
      <div class="${styles.messageBold} modal-messageBold">
				${title}
      </div>
			<div class="${styles.smallMessage({})} modal-smallMessage">
				${description}
			</div>
      <div>
				${confirmButton.render({})}
				${cancelButton.render({})}
      </div>
    </div>
  `
}