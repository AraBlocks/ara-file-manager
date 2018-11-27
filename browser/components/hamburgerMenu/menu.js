'use strict'

const html = require('choo/html')
const MenuItem = require('./menuItem')
const styles = require('./styles/menu')
const Nanocomponent = require('nanocomponent')

class Menu extends Nanocomponent {
	constructor(items = []) {
		super()
		this.props = { items: this.makeButtons(items) }
		this.state = { displayItems: false }
		this.menuClicked = this.menuClicked.bind(this)
	}

	makeButtons(items) {
		return items.map(item => new MenuItem(item))
	}

	update() {
		return true
	}

	menuClicked() {
		const { state } = this
		state.displayItems = !state.displayItems
		this.render()
	}

	createElement() {
		const { props, state, menuClicked } = this

		return html`
			<div class="${styles.container} Menu-container"
				onclick=${menuClicked}
			>
				<img
					class="${styles.hamburger} Menu-hamburger"
					src="../assets/images/utilityButtons/Hamburger.svg"
				/>
				<div class="${styles.menu(state.displayItems)} Menu-menu">
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