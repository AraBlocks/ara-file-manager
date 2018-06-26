const electron = require('electron')
const { app, BrowserWindow} = require('electron')
const windowManager = require('electron-window-manager')

app.on('ready', () => {
  windowManager.init()
  windowManager.open('home', 'Welcome','file://' + __dirname + '/index.html', false, { showDevTools: true })
})