const { events } = require('k')

module.exports = (state, { load = null, type }) => {
  switch (type) {
    case events.CANCEL_SUBSCRIPTION:
      state.transfer = null
      state.transferEth = null
      state.published = []
      state.rewards = []
      break
    case events.FAUCET_ARA_RECEIVED:
      state.faucet = null
      break
    case events.GOT_FAUCET_SUB:
      state.faucet = load.faucetSub
      break
    case events.GOT_PURCHASED_SUBS:
      state.rewards.push(load.rewardsSub)
      state.updates.push(load.updateSub)
      break
    case events.GOT_REGISTRATION_SUBS:
      Object.assign(state, load)
      break
    case events.GOT_SUBSCRIPTIONS:
      state.published.push(...load.publishedSubs)
      state.rewards.push(...load.rewardsSubs)
      state.transfer = load.transferSub
      state.transferEth = load.transferEthSub
      state.updates.push(...load.updateSubs)
      break
    case events.GOT_PUBLISHED_SUB:
      state.published.push(load.publishedSub)
      state.rewards.push(load.rewardsSub)
      break
    case events.GOT_PURCHASED_SUBS:
      state.rewards.push(load.rewardsSub)
      state.updates.push(load.updateSub)
      break
    case events.LOGOUT:
      state.published = []
      state.rewards = []
      break
    default:
      return state
  }
}