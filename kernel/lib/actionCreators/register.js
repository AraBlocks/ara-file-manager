'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:register')
const araContractsManager = require('../actions/araContractsManager')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const { register } = require('../actions')
const {
  LOGIN,
  REGISTER,
  REGISTERED
} = require('../../../lib/constants/stateManagement')

ipcMain.on(REGISTER, async (event, password) => {
  debug('%s heard. load: %s', REGISTER, password)
  try {
    const userAid = await register.create(password)
    await register.archive(userAid)
    const accountAddress = await araContractsManager.getAccountAddress(userAid, password)

    debug('Dispatching %s', LOGIN)
    dispatch({
      type: LOGIN,
      load: {
        userAid,
        accountAddress,
        araBalance: 0,
        password: password,
      }
    })
    event.sender.send(REGISTERED)
  } catch (e) {
    debug('Error: %O', e)
  }
})