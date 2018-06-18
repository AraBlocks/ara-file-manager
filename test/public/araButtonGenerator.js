class AraButtonGenerator {
	constructor() {

  }

  makeButton(license, target) {
    var button = document.createElement("button");
    button.innerHTML = "Ara Button";

    var body = document.getElementsByClassName("ara-buttons")[0];
    body.appendChild(button);

    button.addEventListener ("click", function() {
      const item = JSON.stringify({
        title: 'The Room',
        license: 5,
        description: 'The best movie ever!',
        price: 33
      })
      var wsUri = "ws://localhost:24860";
      var websocket = new WebSocket(wsUri);
      websocket.onopen = function() {
          websocket.send(item);
          alert("Message is sent...");
       };
    });
  }
}