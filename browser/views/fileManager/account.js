const ContextMenu = require('../../components/contextMenu')
const { events } = require('k')
const { menuHelper } = require('./util')
const { windowManagement } = require('../../lib/tools')
const Nanocomponent = require('nanocomponent')
const progressBar = require('./progressBar')
const styles = require('./styles/account')
const html = require('nanohtml')
const Hamburger = require('../../components/hamburger')

class Account extends Nanocomponent {
  constructor({ account, current }) {
    super()

    this.props = { account, current }
    this.state = {
      hambyToggled: false
    }
    this.children = {
      hamby: new Hamburger(this.hambyOpts)
    }

    this.onClick = this.onClick.bind(this)
  }

  get hambyOpts() {
    const items = [
      { children: 'Account', onclick: () => windowManager.openWindow('accountInfo') },
      { children: 'Logout', onclick: () => windowManagement.emit({ event: events.LOGOUT }) },
    ]

    const toggleCB = (type) => {
      type === 'mouseleave'
        ? this.state.hambyToggled = false
        : this.state.hambyToggled = !this.state.hambyToggled
      this.rerender()
    }

    return { items, toggleCB, direction: 'left' }
  }

  onClick() {
    console.log('click')
  }

  update() {
    return true
  }

  createElement() {
    const {
      onClick,
      children,
      props: { account, current }
    } = this

    return (html`
      <div
        class="${styles.mainContainer(current)}"
        style="color: white;"
        onclick=${onClick}
      >
        ${account.slice(0, 8) + '...'}
        <div class="${styles.container}">
          ${children.hamby.render({ current })}
        </div>
      </div>
    `)
  }

  static generator(opts) {
    return new Account(opts)
  }
}

module.exports = Account.generator
