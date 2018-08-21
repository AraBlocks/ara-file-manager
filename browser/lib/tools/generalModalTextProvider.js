'use strict'

const html = require('choo/html')

module.exports = (modalName, fileName) => {
	let title
	let description
	switch (modalName) {
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
		case 'notEnoughAra':
			title = 'Not enough ARA'
			description = html `<div>You do not have enough ARA Tokens to complete<br> this transaction.</div>`
			break
		case 'notEnoughAra2':
			title = 'Not enough ARA'
			description = html `<div>You do not have enough ARA Tokens to publish<br> this file.</div>`
			break
		case 'successModal':
			title = 'Success!'
			description = html `<div><b>${fileName}</b> is downloading now.<br><br>
			Keep files on your computer and host them on
			the network to earn ARA Token rewards.</div>`
			break
		case 'walletEmpty':
			title = 'Not enough ARA'
			description = html `<div>You do not have enough ARA Tokens to continue using your current File Manager services.<br><br>
			<b>Price Maintenance</b> and <b>Littlstar Supernode</b> support has been deactivated accross your account.</div>`
			break
	}
	return { description, title }
}