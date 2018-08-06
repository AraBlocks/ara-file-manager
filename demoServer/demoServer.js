const express = require('express')
const http = require('http');
const app = express()

app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/download/:id/:name/:price/', (req, res) => {
	const item = JSON.stringify({
		fileName: req.params.name,
		aid: req.params.id,
		price: req.params.price
	})

	var post_options = {
			host: 'localhost',
			port: '3002',
			path: '/',
			method: 'POST',
			headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(item),
			},
			withCredentials: true
	};

	var post_req = http.request(post_options, function(res) {});
	post_req.write(item);
	post_req.end();
})
app.listen(3001, () => console.log('Demo server listening on port 3001!'))