const Button = require('../../components/button')
const Input = require('../../components/input')
const { clipboard, remote } = require('electron')
const { app } = remote.require('electron')
const { events } = require('k')
const { utils } = require('../../lib/tools')
const styles = require('./styles/footer')
const TabItem = require('../../components/tabItem')
const windowManagement = require('../../lib/tools/windowManagement')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const windowManager = remote.require('electron-window-manager')

class Footer extends Nanocomponent {
  constructor({ account }) {
    super()

    this.props = {
      account,
      userDID: account.userDID,
    }
    this.state = {
      deepLink: ''
    }

    this.children = {
      downloadButton: new Button({
        children: 'Download Ara Link',
        cssClass: { opts: { height: 3, fontSize: 14, color: 'teal' } },
        onclick: () => {
          this.rerender()
        }
      }),
      publishFilebutton: new Button({
        children: 'Publish New File',
        cssClass: { opts: { height: 3, fontSize: 14, color: 'darkteal' } },
        onclick: () => {
          if (!account.pendingPublish) {
            windowManagement.emit({ event: events.OPEN_MANAGE_FILE_VIEW})
          }
        }
      }),
      deepLink: new Input({
        cssClass: { opts: { fontSize: '14px' } },
        placeholder: 'paste "ara://..." link here',
        onchange: () => {
          const { deepLink } = this.state
          if (!deepLink) { return }
          windowManager.openDeepLinking(deepLink)
          this.state.deepLink = ''
          this.rerender()
        },
        oninput: (value) => {
          this.state.deepLink = value
          this.rerender()
        }
      })
    }
  }

  get publishFileProps() {
    const { account } = this.props
    return {
      cssClass: account.pendingPublish
        ? { name: 'thinBorder', opts: { fontSize: 14 } }
        : { opts: { height: 3, fontSize: 14, color: 'darkteal' } }
    }
  }

  update() {
    return true
  }

  createElement() {
    const {
      children,
      publishFileProps,
      state
    } = this

    return (html`
      <div class="${styles.container()} footer-container">
        <div >
          ${children.deepLink.render({ value: state.deepLink })}
        </div>
        <div class="${styles.downloadButtonHolder} header-downloadButtonHolder">
          ${children.downloadButton.render()}
        </div>
        <div class="${styles.publishFilebuttonHolder} header-publishFilebuttonHolder">
          ${children.publishFilebutton.render(publishFileProps)}
        </div>
      </div>
    `)
  }
}

module.exports = Footer
