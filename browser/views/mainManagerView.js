'use strict'

const Button = require('../components/button')
const FileSection = require('./mainManager/fileSection')
const HamburgerMenu = require('../components/hamburgerMenu/menu')
const styles = require('./styles/mainManagerView')
const UtilityButton = require('../components/utilityButton')
const WalletInfo = require('./mainManager/walletInfo')
const windowManagement = require('../lib/store/windowManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class MainManagerView extends Nanocomponent {
	constructor() {
		super()
		const windowName = 'mainManagerView.js'
		this.expandedState = 0
		windowManagement.setWindowSize(windowName, 400, 325)
		this.props = {}

		this.children = {
      menuButton: new HamburgerMenu({
				items: [
					{ children: 'File Manager' },
				 	{ children: 'Publish File' }, 
				 	{ children: 'Log Out' }, 
					{ children: 'Quit' }
				]
			}),
      closeButton: new UtilityButton({ children: '✕' }),
			wallet: new WalletInfo({ 
				araOwned: 9999, 
				exchangeRate: 1.73 
			}),
			fileSection: new FileSection({ expandedState: this.expandedState, windowName:  'mainManagerView.js'})
    }
	}

	update(){
		return true
	}

	createElement() {
		const { children, props, expandedState } = this
		console.log(expandedState)
		return html`
			<div class=${styles.container}>
        <div class="${styles.horizontalContainer} ${styles.centerAlign}">
          ${children.menuButton.render({})}
					<div class=${styles.header}>
						LTLSTR
					</div>
          ${children.closeButton.render({})}
				</div>
				
				<div class="${styles.subHeader} ${styles.bottomAlign}">
					Wallet
				</div>

				${children.wallet.render(
					{ 
						araOwned: 9999, 
						exchangeRate: 1.73 
					}
				)}
				${children.fileSection.render({ expandedState: 0})}
			</div>
		`
	}	
}

module.exports = MainManagerView