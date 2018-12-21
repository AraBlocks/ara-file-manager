'use strict'

const Button = require('../../components/button')
const { closeModal, openWindow } = require('../../lib/tools/windowManagement')
const { generalModalText } = require('../../lib/tools/generalModalTextProvider')
const html = require('nanohtml')
const styles = require('./styles')

module.exports = ({
  modalName = 'fileMissing',
  load = { fileName: 'Grump Cat', amount: 0 },
  callback = () => {}
}) => {
  const confirmButton = new Button({
		children: 'Confirm',
		onclick: () => {
      callback()
      closeModal('generalMessageModal')
    }
	})
	const { description, title } = generalModalText(modalName, load)
  return html`
    <div class="${styles.container({ justifyContent: 'space-around', height: 95 })} modals-container">
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