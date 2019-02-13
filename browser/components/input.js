const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

const styles = require('./styles/input')

class Input extends Nanocomponent {
  constructor({
    araIcon = false,
    cssClass = {},
    disabled = false,
    embeddedButton = {},
    field = '',
    parentState = {},
    placeholder = '',
    renderView = () => {},
    type = 'text',
    step
  }) {
    super()
    this.props = {
      araIcon,
      cssClass,
      disabled,
      embeddedButton,
      field,
      parentState,
      placeholder,
      renderView,
      type,
      step
    }
    this.state = {
      requiredIndicator: false,
      selection: this.props.embeddedButton.optionList ? this.props.embeddedButton.optionList[0] : '',
      value: parentState[field]
    }
    this.oninput = this.oninput.bind(this)
  }

  oninput(e) {
    const { props, state } = this
    state.value = e.target.value
    props.parentState[props.field] = state.value
    props.renderView()
  }

  select(e) {
    const { props, state } = this
    state.selection = e.target.value
    props.parentState[props.embeddedButton.field] = state.selection
  }

  update({ disabled , requiredIndicator = false, value = null } = {}) {
    const { state, props } = this
    state.value = value || state.value
    state.requiredIndicator = state.requiredIndicator !== requiredIndicator
     ? requiredIndicator
     : state.requiredIndicator
    props.disabled = disabled !== undefined ? disabled : props.disabled
    return true
  }

  createElement() {
    const {
      oninput,
      props,
      select,
      state
    } = this
    return (html`
      <div class="${styles.container({ disabled: props.disabled, required: state.required })} input-container">
        <input class="
          ${styles[props.cssClass.name || 'standard'](props.cssClass.opts || {})} input-dynamicClass
          ${state.requiredIndicator ? styles.requiredIndicator : null} input-requiredIndicator
          ${props.araIcon ? styles.icon + ' input-icon' : null}"
          oninput="${oninput}"
          placeholder="${props.placeholder}"
          value="${state.value}"
          type="${props.type}"
          step="${props.step}"
          disabled="${props.disabled}"
        >
        ${generateButton()}
      </div>
    `)

    function generateButton() {
      let button = html``
      const embeddedButton = props.embeddedButton
      if (embeddedButton.option === 'button') {
        button = html`
          <button
            class="${styles.button} input-button"
            onclick="${embeddedButton.onclick}"
          >
            ${embeddedButton.children}
          </button>`
      } else if (embeddedButton.option === 'selection' && embeddedButton.optionList != null) {
        props.parentState[embeddedButton.field] = embeddedButton.optionList[0]
        button = html`
          <select class="${styles.selection} input-selection" onchange="${select}">
            ${embeddedButton.optionList.map(option => html`<option value="${option}">${option}</option>`)}
          </select>
        `
      }
      return button
    }
  }
}

module.exports = Input