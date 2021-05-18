const express = require('express')

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require('./routes/purchase')(app)
require('./routes/action')(app)

app.listen(PORT, (err) => {
  if (err) console.log(err)
  console.log(`Slack bot server started on port ${PORT}`)
})
