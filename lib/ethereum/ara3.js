'use strict'

const INFURA_ADDRESS = require('./infura')
const araContract = require('./araContract')
const Web3 = require('web3')
var Tx = require('ethereumjs-tx')

class Ara3 extends Web3 {
  constructor({ privateKey = '', publicAddress = '' }) {
    super(new Web3.providers.HttpProvider(INFURA_ADDRESS))

    this.privateKey = privateKey
    this.publicAddress = publicAddress
    this.contract = new this.eth.Contract(araContract.interface, araContract.address)
  }

  async setNonce() {
    return await web3.eth.getTransactionCount(publicAddress)
  }

  async getMeta(vendor, license) {
    try {
      const meta = await this.contract.methods.content(vendor, license).call()
      meta.error = meta.title ? 0 : 1
      return meta
    } catch (e) {
      throw new Error(e)
    }
  }

  async makePurchase(license) {
    try {
      const txCount = await this.eth.getTransactionCount(this.publicAddress)
      const data = this.contract.methods.purchase(license).encodeABI()
      console.log(txCount)
      const tx = new Tx({
        nonce: txCount,
        gasPrice: this.utils.toHex(this.utils.toWei('4', 'gwei')),
        gasLimit: 400000,
        to: araContract.address,
        value: 0,
        data: data,
      })

      tx.sign(new Buffer(this.privateKey, 'hex'))
      const raw = '0x' + tx.serialize().toString('hex')
      this.eth.sendSignedTransaction(raw, console.log)
    } catch (e) {
      throw new Error(e)
    }
  }
}

const ara3 = new Ara3({
  privateKey: '73079d5d87a6ca61f15777e365299ac866fcc536f9b6ca874b7664b2e3ad4fee',
  publicAddress: '0x49666f9302608d14b7358f1a1a6aba451ef7cab9'
})

ara3.makePurchase(5)