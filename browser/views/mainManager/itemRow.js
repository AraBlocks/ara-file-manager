'use strict'

const ProgressRing = require('../../components/progressRing')
const styles = require('./styles/itemRow')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class ItemRow extends Nanocomponent {
	constructor({
		downloadPercent,
		meta,
		name,
		size,
		status
	}) {
		super()
		this.state = {
			downloadPercent,
			meta,
			name,
			size,
			status
		}
		this.children = {
			progressRing: new ProgressRing({ status, downloadPercent })
		}
	}

	update() {
		return true
	}

	createElement() {
		const { children, state } = this
		return html`
			<div class="${styles.container} itemRow-container">
				<div class="${styles.iconHolder} itemRow-iconHolder">
					${children.progressRing.render({ downloadPercent: state.downloadPercent, status: state.status })}
				</div>
				<div class="${styles.summaryHolder} itemRow-summaryHolder">
					<div class="${styles.nameHolder} itemRow-nameHolder">
						<div class="${styles.name} itemRow-name">
							${state.name}
						</div>
					</div>
					<div class="${styles.detailHolder} itemRow-detailHolder">
						${renderSize()} gb
						<div>
							<b>Peers</b>: ${state.meta.peers}
						</div>
					</div>
				</div>
			</div>
		`
		function renderSize() {
			let text
			switch (status) {
				case 0:
				case 2:
					text = state.size
					break
				default:
					text = `${Math.round(state.downloadPercent * state.size * 100) / 100}/${state.size}`
			}
			return text
		}
	}
}

module.exports = ItemRow