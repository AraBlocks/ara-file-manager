'use strict'

const { EventEmitter } = require('events')
const { shell } = require('electron')

/**
 * Private property symbols
 */
const $stack = Symbol('index')
const $index = Symbol('index')

const { freeze, seal } = Object

/**
 * The Navigator class represents location history managed
 * by the application instead of the BrowserWindow (Electron).
 * @public
 * @class Navigator
 * @extends EventEmitter
 */
class Navigator extends EventEmitter {
  static get GOTO() { return 'goto' }
  static get FORWARD() { return 'forward' }
  static get BACKWARD() { return 'backward' }
  static get NAVIGATE() { return 'navigate' }

  /**
   * Navigator class constructor
   * @public
   * @param {?(Array)} [stack = []]
   */
  constructor(stack = [], index = -1) {
    super()
    this.setMaxListeners(Infinity)

    // ensure stack is an array
    if (false == Array.isArray(stack)) {
      stack = []
    }

    // private properties
    this[$stack] = stack
    this[$index] = index
  }

  get GOTO() { return Navigator.GOTO }
  get FORWARD() { return Navigator.FORWARD }
  get BACKWARD() { return Navigator.BACKWARD }
  get NAVIGATE() { return Navigator.NAVIGATE }

  /**
   * Returns a readonly integer to the Navigator instance
   * history index point to the current location value
   * in the history stack.
   */
  get index() {
    return this[$index]
  }

  /**
   * Returns a readonly pointer to the Navigator instance
   * history stack.
   * @public
   * @accessor
   * @type {Array}
   */
  get stack() {
    return freeze(seal(this[$stack].slice()))
  }

  /**
   * Alias to `.stack' getter
   * @public
   * @accessor
   * @type {Array}
   */
  get history() {
    return this.stack
  }

  /**
   * The current value of the Navigator instance
   * history that the internal index points to.
   * @public
   * @accessor
   * @type {String}
   */
  get current() {
    return this[$stack][this[$index]] || null
  }

  /**
   * Alias to the `.current`
   * @public
   * @accessor
   * @type {String}
   */
  get href() {
    return this.current || ''
  }

  /**
   * The length of the Navigator instance history stack.
   * @public
   * @accessor
   * @type {Number}
   */
  get length() {
    return this[$stack].length
  }

  /**
   * Pushes href onto Navigator history stack and
   * increments history index pointer.
   * @public
   * @param {String} href
   * @return {Number}
   * @throws TypeError
   */
  push(href) {
    if (href) {
      if ('string' != typeof href) {
        throw new TypeError("Navigator.push(): Expecting string as href")
      }
      return (this[$index] = this[$stack].push(href) - 1)
    }
    return this[$index]
  }

  /**
   * Pop tail of Navigator instance history stack.
   * @public
   * @return {String}
   */
  pop() {
    if (this[$stack].length) {
      // decrement index if it points to tail of stack
      if (this[$index] == this[$stack].length - 1) {
        void this[$index]--
      }
    }
    return this[$stack].pop() || null
  }

  /**
   * Returns the href in the head position of the Navigator instance
   * history stack.
   * @public
   * @return {String}
   */
  head() {
    return this[$stack][0]
  }

  /**
   * Returns the href in the tail position of the Navigator instance
   * history stack.
   * @public
   * @return {String}
   */
  tail() {
    // clamped index between the left closed interval [0, Infinity)
    const index = Math.max(0, Math.min(Infinity, this[$stack].length - 1))
    return this[$stack][index]
  }

  /**
   * Pushes a href onto Navigator instance history stack
   * if current href pointed to by index is differnet.
   * @public
   * @param {String} href
   * @return {Number}
   */
  goto(href, push = true) {
    const { current } = this

    if (!current || current != href) {
      //the below if statement checks if href is on welcome,create account,sign in, device, payment views, or terms of service
      //if so, navigator just navs there instead of pushing to the history stack and navving

      this.push(href)
      this.emit(Navigator.GOTO)
      this.emit(Navigator.NAVIGATE, this.href)
    }
    return this[$index]
  }

  /**
   * Navigates forward in history by incrementing the Navigator
   * instance history stack index pointer such that `0 <= i < stack length`.
   * @public
   * @return {Number}
   */
  forward() {
    const { length, index } = this
    const next = Math.max(0, Math.min(index + 1, length - 1))
    if (next != this[$index]) {
      this[$index] = next
      this.emit(Navigator.FORWARD, this[$index])
      this.emit(Navigator.NAVIGATE, this.href)
    }
    return this[$index]
  }

  /**
   * Navigates backward in history by decrementing the Navigator
   * instance history stack index pointer such that `0 <= i < stack length`.
   * @public
   * @return {Number}
   */
  backward() {
    const { length, index } = this
    const next = Math.max(0, Math.min(index - 1, length - 1))
    if (next != this[$index]) {
      this[$index] = next
      this.emit(Navigator.BACKWARD, this[$index])
      this.emit(Navigator.NAVIGATE, this.href)
    }
    return this[$index]
  }

  /**
   * Creates a function that invokes an action with a given
   * href. The default action is `goto()`.
   * @public
   * @param {String} href
   * @param {?(String)} [action = 'goto']
   * @return {Function}
   */
  createHandler(href, action = 'goto') {
    return () => {
      return this[action](href)
    }
  }

  /**
   * Opens an external source at a given URL
   * @public
   * @param {String} url
   * @return {Navigator}
   * @throws TypeError
   */
  open(url) {
    if ('string' != typeof url) {
      throw new TypeError("Navigator.open(): Expecting string as URL")
    }
    shell.openExternal(url)
    return this
  }

  restart() {
    this[$stack] = []
    this[$index] = -1
  }
}

/**
 * Module exports.
 */
module.exports = Navigator

