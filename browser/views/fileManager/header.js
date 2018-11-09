'use strict'


const Button = require('../../components/button')
const { CLEAN_UI } = require('../../../lib/constants/stateManagement')
const styles = require('./styles/header')
const UtilityButton = require('../../components/utilityButton')
const TabItem = require('../../components/tabItem')
const {
  emit ,
  minimizeWindow,
  openWindow,
} = require('../../lib/tools/windowManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Header extends Nanocomponent {
  constructor({ selectTab, userAid }) {
    super()

    this.props = { userDID: userAid }

    this.children = {
      publishFilebutton: new Button({
        children: 'Publish New File',
        cssClass: { opts: { color: 'blue', fontSize: 14 } },
        onclick: () => openWindow('publishFileView')
      }),
      closeButton: new UtilityButton({ children: '✕' }),
      minimizeButton: new UtilityButton({ children: '–', onclick: minimizeWindow }),
      tabs: this.makeTabs(selectTab)
    }
  }

  makeTabs(selectTab) {
    const children = ['All Files', 'Published Files', 'Purchases']
    return children.map((child, index) =>
      new TabItem({
        children: child,
        index,
        selectTab
      })
    )
  }

  update(){
    return true
  }

  createElement({ activeTab, araBalance }) {
    console.log('araBalance ',araBalance)
    const { children, props } = this
    return html`
      <div class="${styles.container} header-container">
        <div class="${styles.subHeader} header-subheader">
          <div onclick=${() => emit({ event: CLEAN_UI })}>
            <img style="height: 7px;" src="../assets/images/LTLSTR_Logo_FileManager.png"/>
          </div>
          <div class="${styles.windowControlsHolder} header-windowControlsHolder">
            ${children.minimizeButton.render({ children: '–'})}
            ${children.closeButton.render({ children: '✕'})}
          </div>
        </div>
        <div class="${styles.subHeader} header-subheader">
          <div class="${styles.titleHolder} header-titleHolder">
            File Manager
          </div>
          <div class="${styles.userHolder} header-userHolder">
            <div>
              <b>ID: ${props.userDID.slice(8,14)}...</b>
            </div>
            <div>
              ${araBalance ? Math.round(araBalance * 100) / 100 + ' Ara' : 'Calculating Balance...'} 
            </div>
          </div>
        </div>
        <div class="${styles.tabHolder} header-tabHolder">
          ${children.tabs.map((tab, index) => tab.render({ isActive: activeTab === index}))}
        </div>
        <div class="${styles.publishFilebuttonHolder} header-publishFilebuttonHolder">
          ${children.publishFilebutton.render({})}
        </div>
      </div>
    `
  }
}

module.exports = Header