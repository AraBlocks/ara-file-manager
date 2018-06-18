class AraButtonGenerator {
	constructor() {
    this.wsUri = "ws://localhost:24860"
    this.websocket = new WebSocket(this.wsUri)
    this.websocket.onopen = function() {
      console.log("Websocket connected...")
    }
  }

  sendLicense(license) {
    this.websocket.send(license)
  }

  makeButton(license, target, cssClassName) {
    var button = document.createElement("button")
    button.className = cssClassName

    var body = document.getElementsByClassName(target)[0]
    body.appendChild(button)

    var superClass = this
    button.addEventListener ("click", function() {
      superClass.sendLicense(license)
    });
    return button;
  };
}