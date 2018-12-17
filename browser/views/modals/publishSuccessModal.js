'use strict'

const Button = require('../../components/button')
const { closeModal } = require('../../lib/tools/windowManagement')
const { deeplink } = require('../../lib/tools/')
const html = require('choo/html')
const styles = require('./styles')

module.exports = ({ did, name }) => {
	const encodedName = encodeURIComponent(name)
	const confirmButton = new Button({
		children: 'Confirm',
		onclick: () => closeModal()
	})
	const copyLinkButton = new Button({
		children: 'Copy Link',
		...styles.buttonSelector('green')
	})
  return html`
    <div class="${styles.container({ justifyContent: 'space-around', height: 95 })} modals-container">
      <div class="${styles.fileName} modal-messageBold">
				${name || did.slice(0, 15) + '...'}
      </div>
			<div class="${styles.smallMessage({})} modal-smallMessage">
				${name} has been successfully published!<br><br>
				Use this link to distribute this file to other users:<br>
				<div class="${styles.link}">
					<b>${`ara://download/${did}/${encodedName}`}</b>
				</div>
			</div>
			<div class="${styles.clipboard}" onclick="${function(){
				const span = this.children[1]
				span.classList.add('fadeInUp')
				span.addEventListener('animationend', () => span.classList.remove('fadeInUp'), false)
				deeplink.copyDeeplink(did, name)
			}}">
				${copyLinkButton.render({})}<span>Copied !</span>
			</div>
			<div class="${styles.smallMessage({})} modal-smallMessage">
				You can edit this file and retrieve the distribution link<br>
				<div class="${styles.horizontalContainer}">
					any time by clicking
					<div class="${styles.smallMessage({ color: 'teal' })} ${styles.smallPadding} modal-smallMessage,smallPadding">
						<b>Manage Package</b>
					</div>
					in the full file list.
				</div>
			</div>
			${confirmButton.render({})}
    </div>
  `
}