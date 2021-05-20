require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const { sequel } = require('./models')

const config = require('./config/config')

const hostname = '127.0.0.1'

const app = express()

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use(morgan('combined'))
app.use(cors())
app.use(express.static('public'))

require('./passport')
require('./routes')(app)

global.appRoot = path.resolve(__dirname)

sequel.sync({force: false})
  .then(() => {
    app.listen(config.port, hostname, () => {
      console.log(`Server running at http://${hostname}:${config.port}/`)
      console.log(`dbname - ${config.db.database}`)
    })
  })
