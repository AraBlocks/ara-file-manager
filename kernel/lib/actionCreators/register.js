'use strict'

const accountSelection = require('../actions/accountSelection')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const { register } = require('../actions')
const {
  LOGIN_DEV,
  REGISTER,
  REGISTERED
} = require('../../../lib/constants/stateManagement')
const { blake2b } = require('ara-crypto')
const { toHex } = require('ara-identity/util')

ipcMain.on(REGISTER, async (event, password) => {
  try {
    const araId = await register.create(password)

    const afsId = toHex(blake2b(araId.publicKey))
    await register.archive(araId)
    const [ account ] = accountSelection.osxSurfaceAids().filter(({ afs }) => afs === afsId)

    dispatch({
      type: LOGIN_DEV,
      load: { account, password }
    })

    event.sender.send(REGISTERED)
  } catch (e) {
    console.log(e)
  }
})