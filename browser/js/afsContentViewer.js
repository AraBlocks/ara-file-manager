'use strict'
const AFSExlorer = require('../views/afsContentViewer/container')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { modal: { contentViewerData } } = windowManager.sharedData.fetch('store')
console.log(contentViewerData)
const afsExplorer = new AFSExlorer({
  afsName: "Awesome Cats Collection",
  fileList: [
    { isFile: false, size: 10000, subPath: 'panda', items: [
      {
        isFile: true,
        size: 10000,
        subPath: 'panda.png'
      },
      {
        isFile: false,
        size: 10000,
        subPath: 'Fat_panda',
        items: [
          {
            isFile: true,
            size: 10000,
            subPath: 'fat_panda.png'
          }
        ]
      }
    ]}
  ]
})
document.getElementById('container').appendChild(afsExplorer.render())

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}