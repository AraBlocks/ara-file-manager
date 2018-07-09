'use strict'

const html = require('choo/html')
const MenuItem = require('./menuItem')
const styles = require('./styles/menu')
const Nanocomponent = require('nanocomponent')
class Menu extends Nanocomponent {
	constructor({
		items = []
	}) {
		super()
		this.props = {
			items: this.makeButtons(items)
		}
		this.state = { displayed: false }
	}

	showItems() {
		this.state.displayed = !this.state.displayed
		this.rerender()
	}

	makeButtons(items) {
		return items.map(item => new MenuItem(item))
	}

	update() {
		return true
	}

	createElement() {
		const { props, state: { displayed } } = this
		const showItems = this.showItems.bind(this)
		
		return html`
			<div class="${styles.container} Menu-container">
				<div class="${styles.hamburger} Menu-hamburger" onclick=${showItems}>
					<div class="${styles.menuBar}" Menu-menuBar></div>
					<div class="${styles.menuBar}" Menu-menuBar></div>
					<div class="${styles.menuBar}" Menu-menuBar></div>
				</div>
				<div class="${styles.menu} Menu-menu" style="display: ${displayed ? "flex" : "none"};">
					${props.items.map(item => [item.render(), divider()])}
				</div>
			</div>
		`
		
		function divider() {
			return html`<div class="${styles.divider} Menu-divider"></div>`
		}
	}
}

module.exports = Menu