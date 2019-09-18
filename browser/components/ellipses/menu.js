const html = require('nanohtml')
const MenuItem = require('./menuItem')
const styles = require('./styles/menu')
const Nanocomponent = require('nanocomponent')

class Menu extends Nanocomponent {
	constructor({
		items = [],
		direction = 'right',
		toggleCB = () => { }
	} = {}) {
		super()
		this.props = { items: this.makeButtons(items), toggleCB }
		this.state = { visible: false, direction }
		this.toggleMenu = this.toggleMenu.bind(this)
		this.renderMenuItems = this.renderMenuItems.bind(this)
	}

	makeButtons(items) {
		return items.map(item => new MenuItem(item))
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

	update(newProps = {}) {
		if (newProps.items) {
			newProps.items = this.makeButtons(newProps.items)
		}
		Object.assign(this.props, newProps)
		return true
	}

	createElement({ current }) {
		const { renderMenuItems, state, toggleMenu } = this
		return (html`
			<div class="${styles.container} Menu-container" onclick=${toggleMenu} onmouseleave=${toggleMenu}>
				<img class="${styles.ellipses(current)} Menu-ellipses" src="../assets/images/utilityButtons/ellipses.png" />
				<div class="${styles.menu(state)} Menu-menu">
					<div class="${styles.invisibleItem} Menu-invisibleItem"></div>
					<div class="${styles.divider} Menu-divider"></div>
					${renderMenuItems()}
				</div>
			</div>
		`)
	}
}

module.exports = Menu
