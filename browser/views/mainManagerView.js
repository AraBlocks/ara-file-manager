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
				files: mockFiles() 
			})
    }
	}

	update(){
		return true
	}

	createElement() {
		const { children } = this
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
				${children.fileSection.render({ files: mockFiles() })}
			</div>
		`
	}	
}

function mockFiles() {
  return [
  {
      downloadPercent: 0.4,
      meta: {
        aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
        datePublished: '11/20/1989',
        earnings: 237.43,
        peers: 1003,
        price: 56.99,
      },
      name: 'Adobe Photoshop',
      size: 10.67,
      status: 1,
    },
    {
      downloadPercent: 1,
      meta: {
        aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
        datePublished: '11/20/1989',
        earnings: 54.33,
        peers: 33,
        price: 10.99,
      },
      name: 'Microsoft Word',
      size: 4.67,
      status: 2,
    },
    {
      downloadPercent: 0.8,
      meta: {
        aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
        datePublished: '11/20/1989',
        earnings: 2134.33,
        peers: 14,
        price: 3.99,
      },
      name: 'Microsoft PowerPoint',
      size: 1.67,
      status: 1,
		},
		{
      downloadPercent: 0.8,
      meta: {
        aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
        datePublished: '11/20/1989',
        earnings: 2134.33,
        peers: 53,
        price: 3.99,
      },
      name: 'Microsoft Excel',
      size: 4.23,
      status: 0,
		}, 
		{
      downloadPercent: 0.5,
      meta: {
        aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
        datePublished: '11/20/1989',
        earnings: 2134.33,
        peers: 71,
        price: 3.99,
      },
      name: 'Microsoft PowerPoint',
      size: 5.1,
      status: 2,
    }
  ]
}

module.exports = MainManagerView