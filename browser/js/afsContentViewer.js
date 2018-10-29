'use strict'
const AFSExlorer = require('../views/afsContentViewer/container')
const afsExplorer = new AFSExlorer({
  afsName: "Awesome Cats Collection",
  fileList: [
    { name: 'buff_cat', size: 10000, type: 'Video File', did: '123'},
    { name: 'grump_cat', size: 20000, type: 'PNG File', did: '456' },
    { name: 'mango!', size: 30000, type: 'Folder', did: '679' }
  ],
  parentDirectory: "Cats"
})
document.getElementById('container').appendChild(afsExplorer.render())

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}