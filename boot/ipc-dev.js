const fs = require('fs')
const path = require('path')
const windowManager = require('electron-window-manager')

const views = path.resolve(__dirname, '..', 'browser', 'views')
const modals = path.resolve(__dirname, '..', 'browser', 'views', 'modals')

fs.readdirSync(views).forEach((view, i) => {
  view = view.slice(0, -3)
  windowManager.bridge.on(view, () => {
    makeWindow(view, i)
  })
})

fs.readdirSync(modals).forEach((modal, i) => {
  modal = modal.slice(0, -3)
  windowManager.bridge.on(modal, () => {
    makeWindow(modal, i)
  })
})

const makeWindow = (view, i ) => {
  windowManager.open(
    view,
    view,
    windowManager.loadURL(view),
    false,
    {
      backgroundColor: 'white',
      frame: false,
      ...windowManager.setSize(view)
    }
  )
}