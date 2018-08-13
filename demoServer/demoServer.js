const express = require('express')
const http = require('http');
const app = express()

app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/download/:id/:name', (req, res) => {
	res.sendFile(__dirname + '/public'+ '/index.html')
	const item = JSON.stringify({
		aid: req.params.id,
		fileName: decodeURIComponent(req.params.name),
	})

	const post_options = {
		host: 'localhost',
		port: '3002',
		path: '/',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(item),
		},
		withCredentials: true
	}

	const post_req = http.request(post_options, () => {})
	post_req.write(item)
	post_req.end()
})
app.listen(3001, () => console.log('Demo server listening on port 3001!'))