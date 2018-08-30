'use strict'

const Button = require('../../components/button')
const { closeModal } = require('../../lib/tools/windowManagement')
const { copyDistributionLink } = require('../../lib/tools/windowManagement')
const html = require('choo/html')
const styles = require('./styles')

module.exports = ({ aid = 'e89160647bd617d33ac386ed89f069d366711cafec9036d90805894761a58ebb', fileName = 'Grump Cat' }) => {
	const encodedName = encodeURIComponent(fileName)
	const confirmButton = new Button({
		children: 'Confirm',
		onclick: () => closeModal()
	})
	const copyLinkButton = new Button({
		children: 'Copy Link',
		...styles.buttonSelector('blue'),
		onclick: () => {
			copyDistributionLink(aid, fileName)
		}
	})
  return html`
    <div class="${styles.container} modals-container">
      <div class="${styles.fileName} modal-messageBold">
				${fileName}
      </div>
			<div class="${styles.smallMessage({})} modal-smallMessage">
				has been successfully published!<br><br>
				Use this link to distribute this file to other users:<br>
				<div class="${styles.link}">
					<b>${`lstr://download/${aid}/${encodedName}`}</b>
				</div>
			</div>
			${copyLinkButton.render()}
			<div class="${styles.smallMessage({})} modal-smallMessage">
				You can edit this file and retrieve the distribution link<br>
				<div class="${styles.horizontalContainer}">
					any time by clicking
					<div class="${styles.smallMessage({ color: 'blue' })} ${styles.smallPadding} modal-smallMessage,smallPadding">
						<b>Manage File</b>
					</div>
					in the full file list.
				</div>
			</div>
			${confirmButton.render()}
    </div>
  `
}