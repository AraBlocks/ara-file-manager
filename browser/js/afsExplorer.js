'use strict'
const AFSExlorer = require('../views/afsExplorer/container')
const afsExplorer = new AFSExlorer()
document.getElementById('container').appendChild(afsExplorer.render())

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}