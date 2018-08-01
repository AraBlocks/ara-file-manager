const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/download/:id/:name/:price/', (req, res) => {
	res.sendFile(__dirname + '/public'+ '/index.html')
})
app.listen(3001, () => console.log('Demo server listening on port 3001!'))