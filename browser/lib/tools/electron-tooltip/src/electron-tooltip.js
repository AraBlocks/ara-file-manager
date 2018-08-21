module.exports = ((params = {}) => {

	// Extend the default configuration
	const config = Object.assign({
		offset: '0',
		position: 'top',
		width: 'auto',
		style: {}
	}, params)

	const electron = require('electron')
	const { BrowserWindow } = electron.remote
	const win = electron.remote.getCurrentWindow()

	const path = require('path')
	const url = require('url')

	let tooltipWin = new BrowserWindow({
		resizable: false,
		alwaysOnTop: true,
		focusable: false,
		frame: false,
		show: false,
		hasShadow: false,
		transparent: true
	})

	tooltipWin.loadURL(url.format({
		pathname: path.join(__dirname, 'electron-tooltip.html'),
		protocol: 'file:',
		slashes: true
	}))


	window.onbeforeunload = e => {
		tooltipWin.destroy()
		tooltipWin = null
	}

	tooltipWin.webContents.on('did-finish-load', () => {

		tooltipWin.webContents.send('set-styling', config.style)

		const tooltips = document.querySelectorAll('[data-tooltip-id]')
		Array.prototype.forEach.call(tooltips, tooltip => {

			const tid =  tooltip.getAttribute('data-tooltip-id')
			const contentInfo = {
				tid,
				componentName:  tooltip.getAttribute('data-tooltip-component'),
				args: tooltip.getAttribute('data-tooltip-args')
			}
			tooltipWin.webContents.send('initialize-component', contentInfo)

			tooltip.addEventListener('mouseenter', e => {
				const dimensions = e.target.getBoundingClientRect()
				const localConfig = {
					offset: e.target.getAttribute('data-tooltip-offset') || config.offset,
					width: e.target.getAttribute('data-tooltip-width') || config.width,
					position: e.target.getAttribute('data-tooltip-position') || config.position
				}

				tooltipWin.webContents.send('set-content', {
					config: localConfig,
					tid,
					elmDimensions: dimensions,
					originalWinBounds: win.getContentBounds(),
				})
			})
			// tooltipWin.openDevTools()
			tooltip.addEventListener('mouseleave', e => {
				const dimensions = e.target.getBoundingClientRect()
				const { clientX, clientY } = e
				tooltipWin.webContents.send('reset-content', {
					dimensions,
					mousePosition: {
						x: clientX,
						y: clientY
					},
					location: config.position
				})
			})
		})
	})
})
