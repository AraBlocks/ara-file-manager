const styles = require('./styles/tabItem')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class TabMenu extends Nanocomponent {
  constructor({
    children,
    index,
    selectTab
  }) {
    super()

    this.props = {
      children,
      index,
      selectTab
    }
  }

  update(){
    return true
  }

  createElement({ isActive }) {
    const { props } = this

    return (html`
      <div
        class="${styles.tab(isActive)} tab-tab"
        onclick=${() => props.selectTab(props.index)}
      >
        ${props.children}
      </div>
    `)
  }
}

module.exports = TabMenu