'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:register')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const { register } = require('../actions')
const {
  LOGIN_DEV,
  REGISTER,
  REGISTERED
} = require('../../../lib/constants/stateManagement')

ipcMain.on(REGISTER, async (event, password) => {
  debug('%s heard. load: %s', REGISTER, password)
  try {
    const userAid = await register.create(password)
    await register.archive(userAid)
    const accountAddress = await araContractsManager.getAccountAddress(userAid, password)

    debug('Dispatching %s', LOGIN_DEV)
    dispatch({
      type: LOGIN_DEV,
      load: {
        userAid,
        accountAddress,
        araBalance: 0,
        password: load.password,
      }
    })
    event.sender.send(REGISTERED)
  } catch (e) {
    debug('Error: %O', e)
  }
})