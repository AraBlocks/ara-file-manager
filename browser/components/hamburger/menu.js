'use strict'

const html = require('nanohtml')
const MenuItem = require('./menuItem')
const styles = require('./styles/menu')
const Nanocomponent = require('nanocomponent')

class Menu extends Nanocomponent {
	constructor({items = [], direction = 'right',  toggleCB=()=>{} }) {
		super()
		this.props = { items: this.makeButtons(items), toggleCB }
		this.state = { visible: false, direction }

		this.toggleMenu = this.toggleMenu.bind(this)
		this.renderMenuItems = this.renderMenuItems.bind(this)
	}

	makeButtons(items) {
		return items.map(item => new MenuItem(item))
	}

	update() {
		return true
	}

	toggleMenu(e) {
		const { state, props } = this

		e.type === 'mouseleave'
			? state.visible = false
			: state.visible = !state.visible

		props.toggleCB(e.type)
		this.rerender()
	}

	renderMenuItems() {
		return this.props.items.map(item => [
			item.render(),
			html`<div class="${styles.divider} Menu-divider"></div>`
		])
	}

	createElement() {
		const { renderMenuItems, state, toggleMenu } = this

		return html`
			<div class="${styles.container} Menu-container" onclick=${toggleMenu} onmouseleave=${toggleMenu}>
				<img class="${styles.hamburger} Menu-hamburger" src="../assets/images/utilityButtons/Hamburger.svg" />
				<div class="${styles.menu(state)} Menu-menu" >
					<div class="${styles.invisibleItem} Menu-invisibleItem"></div>
					<div class="${styles.divider} Menu-divider"></div>
					${renderMenuItems()}
				</div>
			</div>
		`
	}
}

module.exports = Menu