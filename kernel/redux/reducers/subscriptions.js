'use strict'

const k = require('../../../lib/constants/stateManagement')

module.exports = (state, { load = null, type }) => {
  switch (type) {
    case k.CANCEL_SUBSCRIPTION:
      state.transfer = null
      state.transferEth = null
      state.published = []
      state.rewards = []
      break
    case k.FAUCET_ARA_RECEIVED:
      state.faucet = null
      break
    case k.GOT_FAUCET_SUB:
      state.faucet = load.faucetSub
      break
    case k.GOT_SUBSCRIPTIONS:
      state.published.push(...load.publishedSubs)
      state.rewards.push(...load.rewardsSubs)
      state.transfer = load.transferSub
      state.transferEth = load.transferEthSub
      break
    case k.GOT_PUBLISHED_SUB:
      state.published.push(load.publishedSub)
      state.rewards.push(load.rewardsSub)
      break
    case k.GOT_REWARDS_SUB:
      state.rewards.push(load.rewardsSub)
      break
    case k.LOGOUT:
      state.published = []
      state.rewards = []
      break
    default:
      return state
  }
  return state
}