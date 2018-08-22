'use strict'

const Button = require('../../components/button')
const { closeModal } = require('../../lib/tools/windowManagement')
const { generalModalText } = require('../../lib/tools/generalModalTextProvider')
const html = require('choo/html')
const styles = require('./styles')

module.exports = ({ modalName = 'fileMissing', fileName = 'Grump Cat' }) => {
  const confirmButton = new Button({
		children: 'Confirm',
		onclick: () => closeModal()
	})
	const { description, title } = generalModalText(modalName, fileName)
  return html`
    <div class="${styles.container} modals-container">
      <div class="${styles.messageBold} modal-messageBold">
				${title}
      </div>
			<div class="${styles.smallMessage({})} modal-smallMessage">
				${description}
			</div>
      <div>
        ${confirmButton.render()}
      </div>
    </div>
  `
}