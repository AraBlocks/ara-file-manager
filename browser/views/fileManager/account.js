const ContextMenu = require('../../components/contextMenu')
const { events } = require('k')
const { menuHelper } = require('./util')
const { windowManagement } = require('../../lib/tools')
const Nanocomponent = require('nanocomponent')
const progressBar = require('./progressBar')
const styles = require('./styles/account')
const html = require('nanohtml')
const Ellipses = require('../../components/ellipses')

class Account extends Nanocomponent {
  constructor({ account, name, current }) {
    super()

    this.props = { account, name, current }
    this.state = {
      ellipsesToggled: false
    }
    this.children = {
      ellipses: new Ellipses(this.ellipsesOpts)
    }

    this.onClick = this.onClick.bind(this)
  }

  get ellipsesOpts() {
    const items = [
      { children: 'Account', onclick: () => windowManager.openWindow('accountInfo') },
      { children: 'Logout', onclick: () => windowManagement.emit({ event: events.LOGOUT }) },
    ]

    const toggleCB = (type) => {
      type === 'mouseleave'
        ? this.state.ellipsesToggled = false
        : this.state.ellipsesToggled = !this.state.ellipsesToggled
      this.rerender()
    }

    return { items, toggleCB, direction: 'left' }
  }

  onClick(e) {
    if (e.target.tagName.toLowerCase() !== 'img') {
      if (!this.props.current) {
        windowManagement.emit({ event: events.CHANGE_ACCOUNT, load: this.props.account })
      } else {
        windowManager.openWindow('accountInfo')
      }
    }
  }

  update(props) {
    this.props = { ...this.props, current: props.current, name: props.name }
    return true
  }

  createElement() {
    const {
      onClick,
      children,
      props: { account, name, current }
    } = this

    return (html`
      <div
        class="${styles.mainContainer(current)}"
        style="color: white;"
        onclick=${onClick}
      >
        ${name.length > 11 ? name.slice(0, 11) + '...' : name}
        <div class="${styles.container}">
          ${children.ellipses.render({ current })}
        </div>
      </div>
    `)
  }

  static generator(opts) {
    return new Account(opts)
  }
}

module.exports = Account.generator
