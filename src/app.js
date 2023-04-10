require('dotenv').config()
const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const router = require("./routes/routes")
const cors = require('cors')

app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/", router)

module.exports = app
