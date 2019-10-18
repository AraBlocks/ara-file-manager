const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

const styles = require('./styles/input')

class Input extends Nanocomponent {
  constructor({
    araIcon = false,
    cssClass = {},
    disabled = false,
    onchange = () => {},
    oninput = () => {},
    placeholder = '',
    requiredIndicator = null,
    renderView = () => {},
    type = 'text',
    step,
    value = '',
    color = 'white'
  } = {}) {
    super()
    this.props = {
      araIcon,
      cssClass,
      disabled,
      onchange,
      oninput,
      placeholder,
      renderView,
      requiredIndicator,
      type,
      step,
      value,
      color
    }

    this.oninput = this.oninput.bind(this)
  }

  oninput({ target }) {
    const { props } = this
    props.oninput(target.value)
    props.renderView()
  }

  update(newProps) {
    Object.assign(this.props, newProps)
    return true
  }

  createElement() {
    const { oninput, props } = this
    return (html`
      <div class="${styles.container({ disabled: props.disabled, required: props.required, color: props.color })} input-container">
        <input class="
          ${styles[props.cssClass.name || 'standard'](props.cssClass.opts)} input-dynamicClass
          ${props.requiredIndicator && styles.requiredIndicator} input-requiredIndicator
          ${props.araIcon && `${styles.icon} input-icon`}"
          onchange="${props.onchange}"
          oninput="${oninput}"
          placeholder="${props.placeholder}"
          value="${props.value}"
          type="${props.type}"
          step="${props.step}"
          disabled="${props.disabled}"
        >
      </div>
    `)
  }
}

module.exports = Input
