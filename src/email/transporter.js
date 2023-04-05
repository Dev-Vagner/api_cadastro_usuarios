const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const OAuth2_client = new OAuth2(process.env.CLIENT_ID_GMAIL, process.env.CLIENT_SECRET_GMAIL)
OAuth2_client.setCredentials( { refresh_token: process.env.REFRESH_TOKEN_GMAIL } )
const acessToken = OAuth2_client.getAccessToken()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.USER_GMAIL,
        clientId: process.env.CLIENT_ID_GMAIL,
        clientSecret: process.env.CLIENT_SECRET_GMAIL,
        refreshToken: process.env.REFRESH_TOKEN_GMAIL,
        acessToken: acessToken
    }
})

module.exports = transporter