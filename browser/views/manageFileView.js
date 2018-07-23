'use strict'

const ManageFileContainer = require('./manageFile/container')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class ManageFileView extends Nanocomponent {
	constructor() {
		super()
		this.state = {}
		const { userData } = windowManager.sharedData.fetch('store')
		this.manageFileContainer = new ManageFileContainer({
			currency: 'USD',
			fileName: 'My Awesome File',
			filePath: '/Documents/FilePath',
			distributionLink: 'http://ltlstr.com/afsname/ahgaksdhftiaygkjahsdfkjahbc',
			price: 9.99,
			priceManagement: true,
			supernode: false,
			userData
		})
	}

	update(){
		return true
	}

	createElement() {
		const { manageFileContainer } = this
		return html`
			<div>
				${manageFileContainer.render({})}
			</div>
		`
	}
}

module.exports = ManageFileView