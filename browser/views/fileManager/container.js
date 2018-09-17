'use strict'

const Header = require('./header')
const Section = require('./section')
const styles = require('./styles/container')
const html = require('choo/html')
const isDev = require('electron-is-dev')
const Nanocomponent = require('nanocomponent')
const tooltip = require('../../lib/tools/electron-tooltip')

class Container extends Nanocomponent {
  constructor({
    account,
    files
  }) {
    super()

    this.state = {
      activeTab: 0,
      files,
      araBalance: account.araBalance
    }

    this.children = {
      header: new Header({
        ...account,
        selectTab: this.selectTab.bind(this)
       }),

      publishedSection: new Section({
        files,
        type: 'published'
      }),

      purchasedSection: new Section({
        files,
        type: 'purchased'
      })
    }

    this.rerender = this.rerender.bind(this)
    if (isDev) { window.components = { fileManager: this } }
  }

  selectTab(index) {
    const { state, rerender } = this
    state.activeTab = index
    rerender()
  }

  update(store){
    this.state.araBalance = store.account.araBalance
    return true
  }

  createElement() {
    const {
      children,
      state: { activeTab, files, araBalance }
    } = this

    tooltip({})
    return html`
      <div>
        <div class="${styles.container} container-container">
          <div>
            ${children.header.render({ activeTab, araBalance })}
            <div class="${styles.sectionContainer} fileManagerContainer-sectionContainer">
              ${files.published.length || files.purchased.length
                ? renderSections().map(section => section.render({ files }))
                : renderNoFilesMsg()}
            </div>
          </div>
        </div>
      </div>
    `

    function renderSections() {
      let sections = []
      switch (activeTab) {
        case 0:
          sections.push(children.publishedSection, children.purchasedSection)
          break
        case 1:
          sections.push(children.publishedSection)
          break
        default:
          sections.push(children.purchasedSection)
      }
      return sections
    }

    function renderNoFilesMsg() {
      return html`
        <div class="${styles.noFilesContainer} fileManager-noFilesContainer">
          <div class="${styles.noFilesHeader} fileManager-noFilesHeader">
            There are no files associated with your account
          </div>
          <p>
            You can download files from users with ARA-enabled links.
            <br>
            You can also publish your own files into the network for distribution.
          </p>
          <p>
            Downloading and hosting files will earn you ARA token rewards,
            <br>
            which can be spent to purchase more content on the network.
          </p>
          <a href="">
            Learn More
          </a>
        </div>

      `
    }
  }
}

module.exports = Container