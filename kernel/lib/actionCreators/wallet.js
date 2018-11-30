'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:subscription')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const request = require('request-promise')
const windowManager = require('electron-window-manager')
const { internalEmitter } = windowManager
const store = windowManager.sharedData.fetch('store')

internalEmitter.on(k.UPDATE_EARNING, (load) => {
  debug('%s HEARD', k.UPDATE_EARNING)
  try {
    dispatch({ type: k.UPDATE_EARNING, load })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
})

internalEmitter.on(k.UPDATE_BALANCE, (load) => {
  debug('%s HEARD', k.UPDATE_BALANCE)
  try {
    dispatch({ type: k.UPDATE_BALANCE, load })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
})

ipcMain.on(k.LISTEN_FOR_FAUCET, async (event, load) => {
  debug('%s HEARD', k.LISTEN_FOR_FAUCET)
  try {
    const options = {
      method: 'POST',
      uri: 'http://api.faucet.ara.one:3000/transfer',
      body: { to: 'b2249c0fa82253e22fa1c0e9a8b2dbdb7d25c51a27a1930f3d219d953381f2cc' },
      json: true
    }
    const txHash = await request.post(options)

    const faucetSub = await subscribeFaucet(store.account.accountAddress)
    dispatch({ type: k.GOT_FAUCET_SUB, load: { txHash, faucetSub } })

    windowManager.pingView({ view: 'accountInfo', event: k.LISTENING_FOR_FAUCET })
  } catch (err) {
    debug('Err requesting from faucet: %o', err)
    windowManager.pingView({ view: 'accountInfo', event: k.FAUCET_ERROR })
  }
})

internalEmitter.on(k.FAUCET_ARA_RECEIVED, () => {
  try {

    debug('%s HEARD', k.FAUCET_ARA_RECEIVED)
    store.subscriptions.faucet.ctx.close()
    dispatch({ type: k.FAUCET_ARA_RECEIVED })

    windowManager.pingView({ view: 'accountInfo', event: k.REFRESH})
  } catch (e) { console.log(e) }

})

const { abi: tokenAbi } = require('ara-contracts/build/contracts/AraToken.json')
const { web3: { contract: contractUtil } } = require('ara-util')
const { ARA_TOKEN_ADDRESS } = require('ara-contracts/constants')

async function subscribeFaucet(userAddress) {
  const { contract, ctx } = await contractUtil.get(tokenAbi, ARA_TOKEN_ADDRESS)

  let subscription
  try {
    subscription = contract.events.Transfer({ filter: { to: userAddress, from: '0x95E1f3e4B308507bbD16f9c3ffA05eA9EadD09C5' } })
      .on('data', async () => windowManager.internalEmitter.emit(k.FAUCET_ARA_RECEIVED))
      .on('error', debug)
  } catch (err) {
    debug('Error %o', err)
  }

  return { ctx, subscription }
}