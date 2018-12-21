'use strict'

const Container = require('./mainManager/container')
const { remote } = require('electron')
const styles = require('./styles/mainManagerView')
const windowManager = remote.require('electron-window-manager')
const { files } = windowManager.sharedData.fetch('store')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class MainManagerView extends Nanocomponent {
	constructor() {
    super()
    this.container = new Container({
      walletInfo: {
				araOwned: 9999,
				exchangeRate: 1.73
      },
      files: files.published
    })
	}

	update(){
		return true
	}

	createElement() {
		const { container } = this
		return html`
      <div class="${styles.container} MainManagerView-container">
        ${container.render()}
			</div>
		`
	}
}

module.exports = MainManagerView