'use strict'

const Nanocomponent = require('nanocomponent')
const styles = require('./styles/menuItem')
const html = require('nanohtml')

class MenuItem extends Nanocomponent {
  constructor({
    children = "",
    onclick = () => { },
    onclickText = ""
  }) {
    super()
    this.state = { children, clicked: false }
    this.props = {
      onclick,
      onclickText,
      originalChildren: children
    }
    this.itemClicked = this.itemClicked.bind(this)
    this.revertChildren = this.revertChildren.bind(this)
    this.rerender = this.rerender.bind(this)
  }

  itemClicked(e) {
    const { props } = this
    props.onclick(e)
    if (props.onclickText) { this.renderNewText(e) }
  }

  renderNewText({ target }) {
    const { state, props } = this
    state.clicked = true
    state.children = props.onclickText
    this.rerender()
    target.addEventListener('transitionend', this.revertChildren)
  }

  async revertChildren({ target }) {
    await new Promise(_ => setTimeout(_, 1000))
    this.state.clicked = false
    this.state.children = this.props.originalChildren
    target.removeEventListener('transitionend', this.revertChildren)
    this.element && this.rerender()
  }

  update() {
    return true
  }

  createElement() {
    const { itemClicked, state } = this

    return (html`
      <div class="${styles.container(state.clicked)} MenuItem-container" onclick=${itemClicked}>
        ${state.children}
      </div>
    `)
  }
}

module.exports = MenuItem