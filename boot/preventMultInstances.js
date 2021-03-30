const { app } = require('electron')

if (!app.requestSingleInstanceLock()) { return app.quit() }

