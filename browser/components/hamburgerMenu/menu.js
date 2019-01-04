'use strict'

const html = require('nanohtml')
const MenuItem = require('./menuItem')
const styles = require('./styles/menu')
const Nanocomponent = require('nanocomponent')

class Menu extends Nanocomponent {
	constructor(items = []) {
		super()
		this.props = { items: this.makeButtons(items) }
		this.state = { displayItems:!false }
		this.toggleMenu = this.toggleMenu.bind(this)
		this.on = this.on.bind(this)
		this.off = this.off.bind(this)
	}

	makeButtons(items) {
		return items.map(item => new MenuItem(item))
	}

	update() {
		return true
	}

	toggleMenu(e) {
		console.log(e.type, e.target)
		const { state } = this
		e.type === 'mouseout'
			? state.displayItems = false
			: state.displayItems = !state.displayItems
		this.render()
	}

	on(e) {
		console.log('on')
		this.state.displayItems = !this.state.displayItems
		this.render()
	}

	off(e) {
		this.state.displayItems = false
		this.render()
	}

	createElement() {
		const { props, state, on, off } = this
		return html`
			<div class="${styles.container} Menu-container"
				onclick=${on}
			>
				<img
					class="${styles.hamburger} Menu-hamburger"
					src="../assets/images/utilityButtons/Hamburger.svg"

				/>
				<div class="${styles.menu(state.displayItems)} Menu-menu"
				onmouseleave=${off}
				>
					<div class="${styles.divider} Menu-divider" ></div>
					${props.items.map(item => [
						item.render(),
					])}
				</div>
			</div>
		`
	}
}

module.exports = Menu