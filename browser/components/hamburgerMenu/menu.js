'use strict'

const html = require('choo/html')
const MenuItem = require('./menuItem')
const styles = require('./styles/menu')
const Nanocomponent = require('nanocomponent')

class Menu extends Nanocomponent {
	constructor(items = []) {
		super()
		this.props = { items: this.makeButtons(items) }
	}

	makeButtons(items) {
		return items.map(item => new MenuItem(item))
	}

	update() {
		return true
	}

	createElement() {
		const { props } = this

		return html`
			<div class="${styles.container} Menu-container">
				<div class="${styles.hamburger} Menu-hamburger">
					<div class="${styles.menuBar}" Menu-menuBar></div>
					<div class="${styles.menuBar}" Menu-menuBar></div>
					<div class="${styles.menuBar}" Menu-menuBar></div>
				</div>
				<div class="${styles.menu} Menu-menu" >
					${props.items.map(item => [
						item.render(),
						html`<div class="${styles.divider} Menu-divider"></div>`
					])}
				</div>
			</div>
		`
	}
}

module.exports = Menu