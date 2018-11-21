'use strict'

const SendAra = require('../views/sendAra')

const sendAra = new SendAra()
document.getElementById('container').appendChild(sendAra.render())