const { clipboard } = require('electron');

module.exports = {
	copyToClipboard(value, referenceKey) {
		clipboard.writeText(value, referenceKey);
	}
}