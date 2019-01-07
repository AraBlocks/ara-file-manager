'use strict'

const html = require('nanohtml')

function generalModalText(modalName, load) {
	let title
	let description
	switch (modalName) {
		case 'araSent':
			title = 'Success!'
			description = html`<div><b>${load.amount} Ara</b> has been sent to <b>${load.did}</b></div>`
			break
		case 'alreadyOwn':
			title = 'You already own this package'
			description = 'You can not purchase this package again'
			break
		case 'diskSpaceModal':
			title = 'Not enough disk space'
			description = 'You do not have enough space to download File Name at this time. \
			You have not been charged the network cost. \
			This file has been added to your account and can be downloaded when you have available space.'
			break
		case 'deleteSuccess':
			title = 'File Deleted'
			description = html`<div><b>${load.fileName}</b> has been successfully deleted from the network.</div>`
			break
		case 'failureModal':
			title = 'Something went wrong'
			description = 'This transaction could not be completed. \
			It could be that the link is no longer valid, or that there are no peers sharing this file right now.'
			break
		case 'failureModal2':
			title = 'Something went wrong'
			description = 'There could be a problem with your file or your ability to access the network. Please check your connection and try again.'
			break
		case 'purchaseFailed':
			title = 'Something went wrong'
			description = 'There could be a problem with with the link or your ability to access the network. Please check your connection and try again.'
			break
		case 'fileMissing':
			title = 'File Missing'
			description = html`<div><b>${load.fileName}</b> has been deleted or altered. You cannot share a file or earn rewards unless it matches the
	published file on the network.<br><br>
	Please restore the file or download it again from the network.</div>`
			break
		case 'generalFailure':
			title = 'Something went wrong'
			description = 'This transaction could not be completed.'
			break
		case 'invalidAddress':
			title = 'Invalid Address'
			description = 'Please enter a valid address'
			break
		case 'invalidAmount':
			title = 'Invalid Amount'
			description = 'Please enter an amount that is greater than 0.'
			break
		case 'invalidDid':
			title = 'Invalid DID'
			description = 'Please enter a valid DID'
			break
		case 'loginFail':
			title = 'Login Failed'
			description = 'Please check your Idenitity and/or password'
			break
		case 'nameUpdated':
			title = "The package's name has been updated"
			description = "You've successfully update this package's name!"
			break
		case 'notEnoughAra':
			title = 'Not enough Ara'
			description = html`<div>You do not have enough Ara Tokens to complete<br> this transaction.</div>`
			break
		case 'notEnoughAra2':
			title = 'Not enough Ara'
			description = html`<div>You do not have enough Ara Tokens to publish<br> this file.</div>`
			break
		case 'notEnoughEth':
			title = 'Not enough Ether'
			description = html`<div>You do not have enough Ether to complete<br> this transaction.</div>`
			break
		case 'notLoggedIn':
			title = 'Not Logged In'
			description = 'Please login before purchasing this file.'
			break
		case 'pendingTransaction':
			title = "Pending Transaction"
			description = "Please wait for your previous transaction to finish"
			break
		case 'successModal':
			title = 'Success!'
			description = html`<div><b>${load.fileName}</b> is downloading now.<br><br>
			Keep files on your computer and host them on
			the network to earn Ara Token rewards.</div>`
			break
		case 'updateSuccessModal':
			title = 'Success!'
			description = html`<div><b>${load.fileName}</b> has been updated on the network.<br><br>
			Keep files on your computer and host them on
			the network to earn Ara Token rewards.</div>`
			break
		case 'recoveryFailure':
			title = 'Failed to Recover Account'
			description = html`<div>It appears the mnemonic you've entered is invalid<br><br>
			Please double check the mnemonic and ensure it's correct.</div>`
			break
		case 'registrationFailed':
			title = 'Something went wrong'
			description = 'There could be a problem with your ability to access the network. Please check your connection and try again.'
			break
	}
	return { description, title }
}

function waitModalText(modalName, load) {
	let description
	switch (modalName) {
		case 'updatingName':
			description = html`<div>Updating package name to <b>${load.packageName}</b></div>`
			break
		default:
			description = load.fileName === 'Unnamed'
				? html`<div>Getting publish estimate for your file</div>`
				: html`<div>Getting publish estimate for <b>${load.packageName}</b></div>`
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

function actionModalText(modalName) {
	let description
	let title
	switch (modalName) {
		case 'startDownload':
			title = 'Purchased!'
			description = 'Download package now?'
			break
		case 'logoutConfirm':
			title = 'Log Out?'
			description = 'This will not alter any files on this computer. Only files linked to the current Ara ID can be shared on the network.'
			break
		case 'quitConfirm':
			title = 'Quit File Manager?'
			description = 'You will not be able to earn Ara Token rewards while File Manager is offline.'
			break
	}
	return { title, description }
}

module.exports = {
	actionModalText,
	generalModalText,
	waitModalText
}