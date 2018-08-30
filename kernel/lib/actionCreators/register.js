'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:register')
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
  debug('%s heard: %s', REGISTER, password)
  try {
    const araId = await register.create(password)

    const afsId = toHex(blake2b(araId.publicKey))
    await register.archive(araId)
    const [account] = accountSelection.osxSurfaceAids().filter(({ afs }) => afs === afsId)

    debug('Dispatching %s', LOGIN_DEV)
    dispatch({
      type: LOGIN_DEV,
      load: { account, password }
    })

    event.sender.send(REGISTERED)
  } catch (e) {
    debug('Error: %O', e)
  }
})