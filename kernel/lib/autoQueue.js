module.exports = class AutoQueue {
  constructor() {
    this.queue = []
  }

  push(transaction) {
    return new Promise((resolve, reject) => {
      this.queue.push({ transaction, resolve, reject })
      if (1 === this.queue.length) this._shift()
    })
  }

  async _shift() {
    const { transaction, resolve, reject } = this.queue[0]
    try {
      const load = await transaction()
      resolve(load)
    } catch (err) {
      reject(err)
    }
    this.queue.shift()
    if (this.queue.length) this._shift()
  }
}