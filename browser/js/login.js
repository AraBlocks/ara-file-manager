'use strict'

const LoginView = require('../views/login')
const loginView = new LoginView()
document.getElementById('container').appendChild(loginView.render())