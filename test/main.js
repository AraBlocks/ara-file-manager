const windowManager = require('../kernel/lib/lsWindowManager')
const { app } = require('electron')
const path = require('path')

app.on('ready', () => {
  require('electron-reload')(path.resolve('test'))

  windowManager.init()
  windowManager.open(
    'testing window',
    'testing',
    windowManager.loadURL('testing'),
    false,
    { backgroundColor: 'white', ...windowManager.setSize('testing') }
  )
})
