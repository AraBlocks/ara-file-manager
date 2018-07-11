'use strict'

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
		this.expandedState = 1
		windowManagement.setWindowSize(windowName, 400, 325)

		this.children = {
			closeButton: new UtilityButton({ children: '✕' }),
      menuButton: new HamburgerMenu({
				items: [
					{ children: 'File Manager' },
				 	{ children: 'Publish File' }, 
				 	{ children: 'Log Out' }, 
					{ children: 'Quit' }
				]
			}),
			wallet: new WalletInfo({ 
				araOwned: 9999, 
				exchangeRate: 1.73 
			}),
			fileSection: new FileSection({ 
				expandedState: this.expandedState, 
				windowName: windowName 
			})
    }
	}

	update(){
		return true
	}

	createElement() {
		const { children, expandedState } = this
		return html`
			<div class="${styles.container} MainManagerView-container">
        <div class="${styles.horizontalContainer} MainManagerView-horizontalContainer">
          ${children.menuButton.render({})}
					<div class="${styles.header} MainManagerView-header">
						LTLSTR
					</div>
          ${children.closeButton.render({})}
				</div>
				
				<div class="${styles.subHeader} ${styles.bottomAlign} MainManagerView-subHeader,bottomAlign">
					Wallet
				</div>

				${children.wallet.render({ 
						araOwned: 9999, 
						exchangeRate: 1.73 
					}
				)}
				${children.fileSection.render()}
			</div>
		`
	}	
}

module.exports = MainManagerView