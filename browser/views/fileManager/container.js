const Header = require('./header')
const Section = require('./section')
const Footer = require('./footer')
const Sidebar = require('./sidebar')
const spinnerBar = require('../../components/spinnerBar')
const styles = require('./styles/container')
const TestnetBanner = require('../../components/testnetBanner')
const { utils } = require('../../lib/tools')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const { shell } = require('electron')

class Container extends Nanocomponent {
  constructor({ account, files, application }) {
    super()

    this.state = {
      activeTab: 0,
      araBalance: account.araBalance,
      bannerToggled: true,
      files,
      loadingLibrary: files.loadingLibrary,
      account,
      accounts: application.accounts
    }

    this.children = {
      sidebar: new Sidebar({
        account: this.state.account,
        accounts: this.state.accounts
      }),
      header: new Header({
        account: this.state.account,
        selectTab: this.selectTab.bind(this)
      }),
      publishedSection: new Section({ files, type: 'published' }),
      purchasedSection: new Section({ files, type: 'purchased' }),
      footer: new Footer({
        account: this.state.account
      }),
    }

    this.rerender = this.rerender.bind(this)
    this.renderSections = this.renderSections.bind(this)
    this.renderNoFilesMsg = this.renderNoFilesMsg.bind(this)
    this.openAraOne = this.openAraOne.bind(this)
  }

  renderSpinnerBars() {
    return (html`
      <div class="${styles.spinnerBarHolder} container-spinnerBarHolder">
        ${spinnerBar()}
      </div>
    `)
  }

  renderSections(network) {
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

  update({ account, files, application }) {
    this.state.araBalance = account.araBalance
    this.state.loadingLibrary = files.loadingLibrary
    this.state.account = account
    this.state.accounts = application.accounts
    return true
  }

  createElement({ application: { network } }) {
    const {
      children,
      renderSections,
      renderSpinnerBars,
      state
    } = this
    const { activeTab, loadingLibrary } = state

    return (html`
      <div>
        <div class="${styles.container} container-container">
          <div class="${styles.sidebar}">
            ${children.sidebar.render(state)}
          </div>
          <div style="width: 100%;">
            ${children.header.render({ activeTab, account: state.account })}
            ${loadingLibrary ? renderSpinnerBars() : renderSections(network)}
            ${children.footer.render()}
          </div>
        </div>
      </div>
    `)
  }
}

module.exports = Container
