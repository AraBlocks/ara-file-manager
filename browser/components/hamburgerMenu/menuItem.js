'use strict'

const html = require('nanohtml')
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
    this.cancelAnimation = this.cancelAnimation.bind(this)
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

  cancelAnimation(e) {
    const { props } = this
    if (props.onclickText === "") { return }
    const span = e.target.children[0]
    span.classList.remove('expand'), false
    span.style.zIndex = -1
    this.render()
  }

  update() {
    return true
  }

  createElement() {
    const { props, itemClicked, cancelAnimation } = this

    return html`
      <div
        class="${styles.container} MenuItem-container"
        data-hamburger=true
        onclick=${itemClicked}
        onmouseleave=${cancelAnimation}
      >
        ${props.children}
        <span>${props.onclickText}</span>
      </div>
    `
  }
}

module.exports = MenuItem