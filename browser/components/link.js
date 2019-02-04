const styles = require('./styles/link')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class Link extends Nanocomponent {
  constructor({
    children = '',
    onclick = () => {},
    cssClass = {},
    onmouseout = () => {},
    onmouseover = () => {},
    type = ''
  }) {
    super()

    this.props = {
      children,
      onclick,
      cssClass,
      onmouseout,
      onmouseover,
      type
    }
  }

  update(newProps) {
    const { props } = this
    Object.assign(props, newProps)
    return true
  }

  createElement() {
    const { props } = this
    return html`
      <a
        class="${styles[props.cssClass.name || 'standard'](props.cssClass.opts || {})}"
        onclick="${props.onclick}"
        onmouseover="${props.onmouseover}"
        onmouseout="${props.onmouseout}"
        type="${props.type}"
      >
        ${props.children}
      </a>
    `
  }
}

module.exports = Link