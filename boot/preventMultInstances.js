const { app } = require('electron')
const { openDeepLinking } = require('electron-window-manager')

const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
  if (process.platform === 'win32') {
    const arg = argv[1]
    if (arg && arg.includes('ara://')) { openDeepLinking(arg) }
  }
})

if (shouldQuit) { return app.quit() }