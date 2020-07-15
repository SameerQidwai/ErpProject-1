const express = require('express')
const port = process.env.PORT || 8080
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, '/dist/')))

app.listen(port, function () {
  console.log('frontEnd server listening on port localhost:' + port + '/')
})
console.log('Server Started')
