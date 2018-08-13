'use strict'

const styles = require('./styles/tabItem')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class TabMenu extends Nanocomponent {
  constructor({
    children,
    index,
    parentState,
    parentRerender
  }) {
    super()

    this.props = {
      children,
      index,
      parentState,
      parentRerender
    }
  }

  selectTab() {
    const { props } = this
    props.parentState.activeTab = props.index
    props.parentRerender()
  }

  update(){
    return true
  }

  createElement({ isActive }) {
    const { props, state } = this
    const selectTab = this.selectTab.bind(this)

    return html`
      <div
        class="${styles.tab(isActive)} tab-tab"
        onclick=${selectTab}
      >
        ${props.children}
      </div>
    `
  }
}

module.exports = TabMenu