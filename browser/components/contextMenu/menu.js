'use strict'

const Nanocomponent = require('nanocomponent')
const MenuItem = require('./menuItem')
const styles = require('./styles/menu')
const html = require('nanohtml')

class ContextMenu extends Nanocomponent {
	constructor({
		items = [],
		direction = 'right',
		closeContextMenu = () => { }
	}) {
		super()
		this.props = {
			closeContextMenu,
			direction,
			items: this.makeButtons(items),
			left: 0,
			top: 0,
			visible: false,
		}
		this.renderMenuItems = this.renderMenuItems.bind(this)
	}

	makeButtons(items) {
		return items.map(item => new MenuItem(item))
	}

	renderMenuItems() {
		return this.props.items.map(item => [
			item.render(),
			(html`<div class="${styles.divider} Menu-divider"></div>`)
		])
	}

	update(newProps) {
		if (newProps.items) {
			newProps.items = this.makeButtons(newProps.items)
		}
		Object.assign(this.props, newProps)
		return true
	}

	createElement() {
		const {
			renderMenuItems,
			props,
			props: { closeContextMenu }
		} = this
		return (html`
			<div
				class="${styles.container({ ...props })} ContextMenu-container"
				onmouseleave=${closeContextMenu}
			>
				<div class="${styles.menu(props)} ContextMenu-menu">
					<div class="${styles.divider} ContextMenu-divider"></div>
					${renderMenuItems()}
				</div>
			</div>
		`)
	}
}

module.exports = ContextMenu