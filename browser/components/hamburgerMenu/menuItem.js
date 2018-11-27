'use strict'

const html = require('choo/html')
const styles = require('./styles/menuItem')
const Nanocomponent = require('nanocomponent')

class MenuItem extends Nanocomponent {
  constructor({
    children = "",
    onclick = () => {},
    onclickText = ""
  }) {
    super()
    this.props = {
      children,
      onclick,
      onclickText
    }
    this.itemClicked = this.itemClicked.bind(this)
  }

  itemClicked(e) {
    const { props } = this
    props.onclick(e)
    if (props.onclickText === "") { return }
    const span = e.target.children[0]
    this.render()
    span.style.zIndex = 1
    span.classList.add('expand')
    span.addEventListener('animationend', () => {
      span.classList.remove('expand'), false
      span.style.zIndex = -1
      this.render()
    })
  }

  update() {
    return true
  }

  createElement() {
    const { props, itemClicked } = this

    return html`
      <div
        class="${styles.container} MenuItem-container"
        onclick=${itemClicked}
      >
        ${props.children}
        <span>${props.onclickText}</span>
      </div>
    `
  }
}

module.exports = MenuItem