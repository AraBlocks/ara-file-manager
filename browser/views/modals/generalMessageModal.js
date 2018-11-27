'use strict'

const Button = require('../../components/button')
const { closeModal, openWindow } = require('../../lib/tools/windowManagement')
const { generalModalText } = require('../../lib/tools/generalModalTextProvider')
const html = require('choo/html')
const styles = require('./styles')

module.exports = ({
  modalName = 'fileMissing',
  load = { fileName: 'Grump Cat', amount: 0 },
  reOpenWindowName = null
}) => {
  const confirmButton = new Button({
		children: 'Confirm',
		onclick: () => {
      if (reOpenWindowName) {
        openWindow(reOpenWindowName)
      }
      closeModal('generalMessageModal')
    }
	})
	const { description, title } = generalModalText(modalName, load)
  return html`
    <div class="${styles.container} modals-container">
      <div class="${styles.messageBold} modal-messageBold">
				${title}
      </div>
			<div class="${styles.smallMessage({})} modal-smallMessage">
				${description}
			</div>
      <div>
        ${confirmButton.render({})}
      </div>
    </div>
  `
}