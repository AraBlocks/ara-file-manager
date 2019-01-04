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
		e.type === 'mouseleave'
			? state.displayItems = false
			: state.displayItems = !state.displayItems
		this.render()
	}


	createElement() {
		const { props, state, toggleMenu } = this
		
		return html`
			<div 
				class="${styles.container} Menu-container"
				onclick=${toggleMenu}
				onmouseleave=${toggleMenu}
			>
				<img
					class="${styles.hamburger} Menu-hamburger"
					src="../assets/images/utilityButtons/Hamburger.svg"
				/>
				<div 
					class="${styles.menu(state.displayItems)} Menu-menu"
					onmouseleave=${toggleMenu}
				>
					<div class="${styles.divider} Menu-divider" ></div>
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