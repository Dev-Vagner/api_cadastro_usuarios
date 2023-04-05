const transporter = require('./transporter')

class SendEmail{
    async tokenNewPassword(email, name, token){ 
        transporter.sendMail({
        from: process.env.USER_GMAIL,
        to: email,
        subject: 'Token para alteração de senha',
        text: 
        `
        Olá, ${name}! 

        O token para alteração da sua senha é: 
        ${token} 
        `
    }).then(() => {
        console.log('O Email, com o token de alteração de senha, foi enviado com sucesso!')
    }).catch((error) => {
        console.log(error)
    })
    }   
}

module.exports = new SendEmail()