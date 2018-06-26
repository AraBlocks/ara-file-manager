class AraButtonGenerator extends WebSocket {
	constructor(uri) {
    super(uri)
    this.onopen = () => { console.log("Websocket connected...") }
  }

  sendLicense(license) {
    this.send(license)
  }

  makeButton(license, target, cssClassName) {
    const button = document.createElement("button")
    button.className = cssClassName

    const body = document.getElementsByClassName(target)[0]
    body.appendChild(button)

    button.addEventListener ("click", () => {
      sendLicense(license)
    })
    return button
  }
}