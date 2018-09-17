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
		this.props = {
			name,
			size
		}
		this.state = {
			downloadPercent,
			meta,
			status
		}
		this.children = {
			progressRing: new ProgressRing({ status, downloadPercent })
		}
	}

	update({ downloadPercent, status }) {
		const { state } = this
		const sameStatus = state.downloadPercent == downloadPercent && state.status == status 
		if (!sameStatus) {
			Object.assign(this.state, { downloadPercent, status })
		}
		return !sameStatus
	}

	createElement() {
		const { children, props, state } = this
		return html`
			<div class="${styles.container} itemRow-container">
				<div class="${styles.iconHolder} itemRow-iconHolder">
					${children.progressRing.render({
						downloadPercent: state.downloadPercent,
						status: state.status
					})}
				</div>
				<div class="${styles.summaryHolder} itemRow-summaryHolder">
					<div class="${styles.nameHolder} itemRow-nameHolder">
						<div class="${styles.name} itemRow-name">
							${props.name}
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
					text = props.size
					break
				default:
					text = `${Math.round(state.downloadPercent * props.size * 100) / 100}/${props.size}`
			}
			return text
		}
	}
}

module.exports = ItemRow