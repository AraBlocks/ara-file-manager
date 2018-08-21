'use strict'

const html = require('choo/html')

module.exports = (optionType) => {
	let title
	let description
	switch (optionType) {
		case 'supernode':
			title = 'Host on Littlstar Supernode'
			description = '5.00 ARA per month'
			break
		case 'priceManagement':
			title = 'Turn on Price Maintenance'
			description = 'Hourly fee based on current network costs (~0.01 - 0.05 ARA)'
			break
		default:
			break
	}
	return { title, description }
}
