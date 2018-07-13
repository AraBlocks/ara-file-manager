'use strict'

const path = require('path')
const fs = require('fs')
const windowManager = require('electron-window-manager')

const views = path.resolve(__dirname, '..', 'browser/views')
const popup = 'file://' + path.resolve(__dirname, '..', 'browser/popup.html')

fs.readdirSync(views).forEach((view, i) => {
  view = view.slice(0, -3)
  windowManager.bridge.on(view, () => {
    makeWindow(view, i)
  })
})

const makeWindow = (view, i ) => {
  windowManager.open(
    view,
    `Window ${i}`,
    popup,
    false,
    {
      ...windowManager.setSize(view),
      showDevTools: true,
      resizable: true
    }
  )
}