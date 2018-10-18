'use strict'
const DragDropArea = require('../components/dragDropArea')
const state = { fileList: null }
const dragDropArea = new DragDropArea({ field: 'fileList', parentState: state })
document.getElementById('container').appendChild(dragDropArea.render())
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}