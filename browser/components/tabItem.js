'use strict'

const styles = require('./styles/tabItem')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class TabMenu extends Nanocomponent {
  constructor({
    children,
    index,
    isActive,
    parentState,
    parentRerender
  }) {
    super()

    this.state = { isActive }

    this.props = {
      children,
      index,
      parentState,
      parentRerender
    }
  }

  selectTab() {
    const { props, state } = this
    props.parentState.activeTab = props.index
    props.parentRerender()
  }

  update({ isActive }){
    const { state } = this
    const isSame = isActive === state.isActive
    if (!isSame) {
      state.isActive = isActive
    }
    return !isSame
  }

  createElement() {
    const { props, state } = this
    const selectTab = this.selectTab.bind(this)

    return html`
      <div
        class="${styles.tab(state.isActive)} tab-tab"
        onclick=${selectTab}
      >
        ${props.children}
      </div>
    `
  }
}

module.exports = TabMenu