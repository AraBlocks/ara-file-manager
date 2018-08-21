'use strict'

const { copyToClipboard } = require('../../../windowManagement')
const styles = require('./styles')
const html = require('choo/html')

module.exports = ({ meta, name }) => {
	return html`
		<div class="${styles.fileTooltip} tooltip-fileTooltip">
			<div>
				<div>
					AFS Id:
				</div>
				<div class="${styles.aid} toolTip-aid">
					${meta.aid.slice(0, 30) + '...'}
				</div>
			</div>
			<div
				style="
				position: relative;
				width: 100%;
				"
				class="${styles.clipboard} fileDescriptor-clipboard"
				onclick=${function(){
					const span = this.children[0]

					span.classList.add('fadeInUp')
					span.addEventListener('animationend', () => span.classList.remove('fadeInUp'), false)

					const encodedName = encodeURIComponent(name)
					copyToClipboard(`http://localhost:3001/download/${meta.aid}/${encodedName}`)
				}}
			>
				Copy Distribution Link<span>Copied !</span>
			</div>
			<div>
				First Published: <span class="${styles.published} fileDescriptor-published">${meta.datePublished}</span>
			</div>
		</div>
	`
}