'use strict'

const html = require('choo/html')

function generalModalText(modalName, fileName) {
	let title
	let description
	switch (modalName) {
		case 'alreadyOwn':
			title = 'You already own this content'
			description = 'You can not purchase this content again'
			break
		case 'diskSpaceModal':
			title = 'Not enough disk space'
			description = 'You do not have enough space to download File Name at this time. \
			You have not been charged the network cost. \
			This file has been added to your account and can be downloaded when you have available space.'
			break
		case 'deleteSuccess':
			title = 'File Deleted'
			description = html `<div><b>${fileName}</b> has been successfully deleted from the network.</div>`
			break
		case 'failureModal':
			title = 'Something went wrong'
			description = 'This transaction could not be completed. \
			It could be that the link is no longer valid, or that there are no peers sharing this file right now.'
			break
		case 'failureModal2':
			title = 'Something went wrong'
			description = 'There could be a problem with with your file or your ability to access the network. Please check your connection and try again.'
			break
		case 'fileMissing':
			title = 'File Missing'
			description = html `<div><b>${fileName}</b> has been deleted or altered. You cannot share a file or earn rewards unless it matches the published file on the network.<br><br>
			Please restore the file or download it again from the network.</div>`
			break
		case 'loginFail':
			title = 'Login Failed'
			description = 'Please check your aid and password'
			break
		case 'notEnoughAra':
			title = 'Not enough Ara'
			description = html `<div>You do not have enough Ara Tokens to complete<br> this transaction.</div>`
			break
		case 'notEnoughAra2':
			title = 'Not enough Ara'
			description = html `<div>You do not have enough Ara Tokens to publish<br> this file.</div>`
			break
		case 'notLoggedIn':
			title = 'Not Logged In'
			description = 'Please login before purchasing this file.'
			break
		case 'successModal':
			title = 'Success!'
			description = html `<div><b>${fileName}</b> is downloading now.<br><br>
			Keep files on your computer and host them on
			the network to earn Ara Token rewards.</div>`
			break
		case 'updateSuccessModal':
			title = 'Success!'
			description = html `<div><b>${fileName}</b> has been updated on the network.<br><br>
			Keep files on your computer and host them on
			the network to earn Ara Token rewards.</div>`
			break
		case 'walletEmpty':
			title = 'Not enough ARA'
			description = html `<div>You do not have enough Ara Tokens to continue using your current File Manager services.<br><br>
			<b>Price Maintenance</b> and <b>Littlstar Supernode</b> support has been deactivated accross your account.</div>`
			break
	}
	return { description, title }
}

function waitModalText(modalName, fileName) {
	let description
	switch (modalName) {
		case 'pleaseWait':
			description = html`<div>Completing transaction and connecting to<br>peers on the network.</div>`
			break
		case 'pleaseWaitUploading':
			description = html `<div>Publishing <b>${fileName}</b> to Ara Network and uploading to Littlstar Supernode.</div>`
			waitTime = html `<div>This may take a while.<br><b>Do not close File Manager.</b></div>`
			break
		case 'pleaseWaitUploading2':
			description = html `<div>Updating <b>${fileName}</b> on the Ara Network.</div>`
			waitTime = html `<div>This may take a while.<br><b>Do not close File Manager.</b></div>`
			break
		default:
			description = fileName === 'Unnamed'
				? html`<div>Getting publish estimate for your file</div>`
				: html`<div>Getting publish estimate for <b>${fileName}</b>.</div>`
	}
	const waitTime = html`
		<div>
			This may take a while.
			<br>
			<b>Do not close File Manager.</b>
		</div>
	`
	return { description, waitTime }
}

module.exports = {
	generalModalText,
	waitModalText
}