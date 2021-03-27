const { app } = require('electron')
const { openDeepLinking } = require('electron-window-manager')

if (!app.requestSingleInstanceLock()) { return app.quit() }
else {
	app.on('second-instance', (event, argv, workingDirectory) => {
		if (process.platform === 'win32') {
			const arg = argv[1]
			if (arg && arg.includes('ara://')) { openDeepLinking(arg) }
		}
	})
}

