const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.static(__dirname + '/public'))
app.listen(3001, () => console.log('Demo server listening on port 3001!'))