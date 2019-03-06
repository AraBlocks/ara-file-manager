module.exports = class AutoQueue {
  constructor() {
    this.queue = []
  }

  push(...transactions) {
    return Promise.all(transactions.map(event => {
      return new Promise((resolve, reject) => {
        this.queue.push({ event, resolve, reject })
        if (1 === this.queue.length) this._shift()
      })
    }))
  }

  async _shift() {
    const [{ event, resolve, reject }] = this.queue
    try {
      const load = await event()
      resolve(load)
    } catch (err) {
      reject(err)
    }
    this.queue.shift()
    if (this.queue.length) this._shift()
  }
}