const Registration = require('../views/registration')
const registration = new Registration({})
document.getElementById('container').appendChild(registration.render({}))
