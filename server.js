const express = require('express')

const app = express()

app.post('/tx')

const PORT = 2486
app.listen(PORT, () => console.log(`Listening at ${PORT}`))