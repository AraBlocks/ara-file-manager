const araContractsManager = require('./kernel/lib/actions/araContractsManager')

araContractsManager.getEarnings([{meta: { aid: 'e7f92b267eaabfc6c99932f479801cfc0c68f1c361873ba4f132ef56d627a0ba'}}])
  .then(console.log)
