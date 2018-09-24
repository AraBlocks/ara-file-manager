'use strict'

const { REGISTER } = require('../../lib/constants/stateManagement')
const { emit } = require('../../browser/lib/tools/windowManagement')

module.exports = () => emit({ event: REGISTER, load: null })