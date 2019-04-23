const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow
app.on('ready', () => {
  mainWindow = new BrowserWindow
  mainWindow.loadFile(path.resolve(__dirname, 'index.html'))
})