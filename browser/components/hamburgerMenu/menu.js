'use strict'

const html = require('nanohtml')
const MenuItem = require('./menuItem')
const styles = require('./styles/menu')
const Nanocomponent = require('nanocomponent')

class Menu extends Nanocomponent {
	constructor(items = []) {
		super()
		this.props = { items: this.makeButtons(items) }
		this.state = { displayItems: false }
		this.toggleMenu = this.toggleMenu.bind(this)
	}

	makeButtons(items) {
		return items.map(item => new MenuItem(item))
	}

	update() {
		return true
	}

	toggleMenu(e) {
		const { state } = this
		if (e.type === 'mouseleave' && e.toElement.dataset.hamburger !== "true") { state.displayItems = false }
		if (e.type === 'click') { state.displayItems = !state.displayItems }
		this.render()
	}

	createElement() {
		const { props, state, toggleMenu } = this

		return html`
			<div class="${styles.container} Menu-container"
				onclick=${toggleMenu}
				data-hamburger=true
			>
				<img
					class="${styles.hamburger} Menu-hamburger"
					src="../assets/images/utilityButtons/Hamburger.svg"
					data-hamburger=true
				/>
				<div class="${styles.menu(state.displayItems)} Menu-menu"
					data-hamburger=true
					onmouseleave=${toggleMenu}
				>
					${props.items.map(item => [
						item.render(),
						html`<div class="${styles.divider} Menu-divider" data-hamburger=true></div>`
					])}
				</div>
			</div>
		`
	}
}

module.exports = Menu