'use strict'

const ImportMnemonic = require('../views/import')
const importMnemonic = new ImportMnemonic()
document.getElementById('container').appendChild(importMnemonic.render())