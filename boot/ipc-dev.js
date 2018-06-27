'use strict'

const path = require('path')
const fs = require('fs')
const windowManager = require('electron-window-manager')

const views = path.resolve(__dirname, '..', 'browser/views')
const popup = 'file://' + path.resolve(__dirname, '..', 'browser/popup.html')

fs.readdirSync(views).forEach((view, i) => {
  windowManager.bridge.on(view, () => {
    makeWindow(view, i)
  })
})

const makeWindow = (view, i ) => {
  const window = windowManager.open(
    view,
    `Window ${i}`,
    popup,
    false,
    {
      width: 400,
      height: 400,
      showDevTools: false
    }
  )
}