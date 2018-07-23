'use strict'

const { register } = require('../actions')
const {
  LOGIN_DEV,
  REGISTER,
  REGISTERING,
  REGISTERED
} = require('../../../lib/constants/stateManagement')
const { blake2b } = require('ara-crypto')
const { toHex } = require('ara-identity/util')
const windowManager = require('electron-window-manager')

windowManager.bridge.on(REGISTER, async (password = 'abc') => {
  windowManager.bridge.emit(REGISTERING)
  const araId = await register.create(password)
  const afsId = toHex(blake2b(araId.publicKey))
  const load = await register.archive(araId)
  windowManager.bridge.emit(LOGIN_DEV, { afsId, password })
  windowManager.bridge.emit(REGISTERED, { load, araId })
})