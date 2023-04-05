const validator = require('validator')
const User = require('../models/User')
const PasswordToken = require('../models/PasswordToken')
const bcrypt = require('bcrypt')

class UserValidate{
    async nameFormat(name){

        var emptySpace = (string) => string.indexOf('  ') >= 0

        if(name == undefined || validator.isEmpty(name)){
            return {status: 400, error: "É necessário digitar um nome!"}
        }else if(emptySpace(name) || name.length < 3){
            return {status: 400, error: "Nome inválido: o nome precisa conter pelo menos 3 caracteres e não pode conter 2 espaços vazios seguidos!"}
        }else{
            return {status: 200, sucess: "Nome válido!"}
        }
    }

    async emailFormat(email){
        if(email == undefined || validator.isEmpty(email)){
            return {status: 400, error: 'É necessário digitar um email!'}
        }else if(!validator.isEmail(email)){
            return {status: 400, error: 'Email inválido!'}
        }else{
            return {status: 200, sucess: "Email válido!"}
        }
    }

    async passwordFormat(password){

        var emptySpace = (string) => string.indexOf(' ') >= 0

        if(password == undefined || validator.isEmpty(password)){
            return {status: 400, error: 'É necessário digitar uma senha!'}
        }else if(emptySpace(password) || password.length < 5){
            return {status: 400, error: "Senha inválida: a senha precisa conter pelo menos 5 caracteres e não pode conter espaço vazio!"}
        }else{
            return {status: 200, sucess: 'Senha válida!'}
        }
    }

    async login(email, password){
        if(email == undefined || validator.isEmpty(email) || password == undefined || validator.isEmpty(password)){
            return {status: 400, error: "Defina os campos do email e da senha!"}
        }else{
            var user = await User.findByEmail(email)
            if(user.error){
                return {status: user.status, error: user.error}
            }else{
                var correctPassword = await bcrypt.compare(password, user.data.password)
                if(correctPassword){
                    return user.data
                }else{
                    return {status: 404, error: 'Senha incorreta!'}
                }
            }
        }
    }

    async emailMatchesUserLogged(id, email){
        var user = await User.findByEmail(email)
        if(user.data){
            if(user.data.id == id){
                return user.data
            }else{
                return {status: 403, error: 'Este email não corresponde ao email do usuário logado!'}
            }
        }else{
            return {status: user.status, error: user.error}
        }
        
    }

    async tokenChangePassword(id, token){
        if(token == undefined || validator.isEmpty(token)){
            return {status: 400, error: 'É necessário enviar algum token!'}
        }else{
            var validToken = await PasswordToken.validate(id, token)
            if(validToken.error){
                return {status: validToken.status, error: validToken.error}
            }else{
                return {status: validToken.status, sucess: validToken.sucess}
            }
        }
    }
}

module.exports = new UserValidate()