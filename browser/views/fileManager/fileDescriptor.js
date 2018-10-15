'use strict'

const k = require('../../../lib/constants/stateManagement')
const Hamburger = require('../../components/hamburgerMenu/menu')
const styles = require('./styles/fileDescriptor')
const filesize = require('filesize')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileDescriptor extends Nanocomponent {
  constructor({
    did,
    name,
    path,
    size = 0,
  }) {
    super()

    this.props = {
      did,
      name,
      path,
      size
    }

    this.children = { hamburger: new Hamburger({}) }
  }

  createSummary({ status, name, size, downloadPercent }) {

    console.log(name)
    console.log([status, size, downloadPercent])
    let nameHTML
    let sizeHTML
    switch (status) {
      case k.OUT_OF_SYNC:
        nameHTML = html`
          <div class="${styles.nameHolder} fileDescriptor-nameHolder">
            <div class="${styles.name} fileDescriptor-name">
              ${[html`<span class="${styles.exclamation} fileDescriptor-exclamation">!</span> `, ' ' + name]}
            </div>
          </div>`
        sizeHTML = html`
          <div class="${styles.sizeHolder(status)} fileDescriptor-sizeHolder">
            ${[filesize(size).toLowerCase(), ' ' + '(Out of Sync)']}
          </div>
        `
        break
      case k.DOWNLOADING:
        nameHTML = html`
          <div class="${styles.nameHolder} fileDescriptor-nameHolder">
            <div class="${styles.name} fileDescriptor-name">
              ${name}
            </div>
          </div>
        `
        sizeHTML = html`
          <div class="${styles.sizeHolder(status)} fileDescriptor-sizeHolder">
            ${Math.round(filesize(downloadPercent * size).slice(0, -2))} / ${filesize(size).toLowerCase()}
          </div>
        `
        break
      case k.DOWNLOADED:
        nameHTML = html`
          <div class="${styles.nameHolder} fileDescriptor-nameHolder">
            <div class="${styles.name} fileDescriptor-name">
              ${name}
            </div>
          </div>
        `
        sizeHTML = html`
          <div class="${styles.sizeHolder(status)} fileDescriptor-sizeHolder">
            ${filesize(size).toLowerCase()}
          </div>
        `
      case k.AWAITING_DOWNLOAD:
        nameHTML = html`
          <div class="${styles.nameHolder} fileDescriptor-nameHolder">
            <div class="${styles.name} fileDescriptor-name">
              ${name}
            </div>
          </div>
        `
        sizeHTML = html`
          <div class="${styles.sizeHolder(status)} fileDescriptor-sizeHolder">
            ${filesize(size).toLowerCase()}
          </div>
        `
      default://DOWNLOADED_PUBLISHED
        nameHTML = html`
          <div class="${styles.nameHolder} fileDescriptor-nameHolder">
            <div class="${styles.name} fileDescriptor-name">
              ${name}
            </div>
          </div>
        `
        sizeHTML = html`
        <div class="${styles.sizeHolder(status)} fileDescriptor-sizeHolder">
          ${filesize(size).toLowerCase()}
        </div>
      `
    }
    return [nameHTML, sizeHTML]
  }

  styleSize({ size, status })
  update() {
    return true
  }

  createElement({ status, downloadPercent }) {
    const {
      children,
      props,
      createSummary
    } = this

    return html`
      <div class="${styles.container} fileDescriptor-container">
        <div class="${styles.hamburgerHolder} fileDescriptor-hamburgerHolder">
          <div class="${styles.hamburger} fileDescriptor-hamburger">
            ${children.hamburger.render({})}
          </div>
        </div>
        <div class="${styles.summaryHolder} fileDescriptor-summaryHolder">
          ${createSummary({
        status,
        downloadPercent,
        name: props.name,
        size: props.size
      })}
        </div>
      </div>
    `
  }
}

module.exports = FileDescriptor