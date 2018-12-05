'use strict'

const Header = require('./header')
const Section = require('./section')
const spinnerBar = require('../../components/spinnerBar')
const styles = require('./styles/container')
const TestnetBanner = require('../../components/testnetBanner')
const { utils } = require('../../lib/tools')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const { shell } = require('electron')

class Container extends Nanocomponent {
  constructor({ account, files }) {
    super()

    this.state = {
      activeTab: 0,
      araBalance: account.araBalance,
      bannerToggled: true,
      files,
      loadingLibrary: files.loadingLibrary
    }

    this.children = {
      header: new Header({
        account,
        selectTab: this.selectTab.bind(this)
      }),
      publishedSection: new Section({ files, type: 'published' }),
      purchasedSection: new Section({ files, type: 'purchased' })
    }

    this.rerender = this.rerender.bind(this)
    this.renderSections = this.renderSections.bind(this)
    this.renderNoFilesMsg = this.renderNoFilesMsg.bind(this)
    this.openAraOne = this.openAraOne.bind(this)
  }

  renderSpinnerBars() {
    return html`
      <div class="${styles.spinnerBarHolder} container-spinnerBarHolder">
        ${spinnerBar()}
      </div>
    `
  }

  renderSections() {
    const {
      children,
      renderNoFilesMsg,
      state: { activeTab, files }
    } = this

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

    return html`
      <div class="${styles.sectionContainer} fileManagerContainer-sectionContainer">
        ${files.published.length || files.purchased.length
          ? sections.map(section => section.render({ files }))
          : renderNoFilesMsg()}
      </div>`
  }

  openAraOne() {
    shell.openExternal('https://ara.one')
  }

  renderNoFilesMsg() {
    const { openAraOne } = this
    return html`
      <div class="${styles.noFilesContainer} fileManager-noFilesContainer">
        <div class="${styles.noFilesHeader} fileManager-noFilesHeader">
          There are no files associated with your account
        </div>
        <p>
          You can download files from users with Ara-enabled links.
          <br>
          You can also publish your own files into the network for distribution.
        </p>
        <p>
          Downloading and hosting files will earn you Ara token rewards,
          <br>
          which can be spent to purchase other packages on the network.
        </p>
        <a onclick="${openAraOne}">
          Learn More
        </a>
      </div>
    `
  }

  selectTab(index) {
    const { state, rerender } = this
    state.activeTab = index
    rerender()
  }

  update({ account, files }) {
    this.state.araBalance = account.araBalance
    this.state.loadingLibrary = files.loadingLibrary
    return true
  }

  createElement({ application: { network } }) {
    const {
      children,
      renderSections,
      renderSpinnerBars,
      state
    } = this

    const {
      activeTab,
      araBalance,
      loadingLibrary,
    } = state

    return html`
      <div>
        ${utils.shouldShowBanner(network) ? TestnetBanner() : html`<div></div>`}
        <div class="${styles.container} container-container">
          <div>
            ${children.header.render({ activeTab, araBalance })}
            ${loadingLibrary ? renderSpinnerBars() : renderSections()}
          </div>
        </div>
      </div>
    `
  }
}

module.exports = Container