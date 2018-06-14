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

  async getNonce() {
    return await web3.eth.getTransactionCount(this.publicAddress)
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
      const data = this.contract.methods.purchase(license).encodeABI()

      const tx = new Tx({
        nonce: this.getNonce(),
        gasPrice: this.utils.toHex(this.utils.toWei('4', 'gwei')),
        gasLimit: 400000,
        to: araContract.address,
        value: 0,
        data
      })

      const signedTx = this.sign(tx)
      this.eth.sendSignedTransaction(signedTx, console.log)
    } catch (e) {
      throw new Error(e)
    }
  }

  sign(tx) {
    tx.sign(new Buffer(this.privateKey, 'hex'))
    return '0x' + tx.serialize().toString('hex')
  }
}