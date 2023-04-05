require('dotenv').config()
const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const router = require("./routes/routes")
const cors = require('cors')

app.use(cors())
 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/", router)

module.exports = app
