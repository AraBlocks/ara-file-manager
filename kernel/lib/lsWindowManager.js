'use strict'

const windowManager = require('electron-window-manager')

windowManager.setSize = function (view) {
  let width
  let height
  switch (view) {
    case 'registration':
      width = 400
      height = 350
      break
    case 'fManagerView':
      width = 520
      height = 730
      break
    case 'mainManagerView':
      width = 400
      height = 325
      break
    default:
      width = 300
      height = 300
  }
  return { width, height }
}

module.exports = windowManager