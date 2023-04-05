const User = require('../models/User')
const PasswordToken = require('../models/PasswordToken')
const SendEmail = require('../email/SendEmail')
const UserValidate = require('../validate/UserValidate')
const jwt = require('jsonwebtoken')
const secret = process.env.PASSWORD_JWT

class UserController {

    async findAllUsers(req, res){
        var users = await User.findAll()
        if(users.status == 200){
            res.status(users.status)
            res.json(users.data)
            return
        }else{
            res.status(users.status)
            res.json({error: users.error})
            return
        }
    }

    async findUser(req, res){
        var id = req.params.id

        var user = await User.findById(id)
        if(user.status == 200){
            res.status(user.status)
            res.json(user.data)
            return 
        }else{
            res.status(user.status)
            res.json({error: user.error})
            return
        }
    }

    async create(req, res){
        var {name, email, password} = req.body

        var validateNameFormat = await UserValidate.nameFormat(name)
        if(validateNameFormat.error){
            res.status(validateNameFormat.status)
            res.json({error: validateNameFormat.error})
            return
        }

        var validateEmailFormat = await UserValidate.emailFormat(email)
        if(validateEmailFormat.error){
            res.status(validateEmailFormat.status)
            res.json({error: validateEmailFormat.error})
            return
        }

        var checkRegisteredEmail = await User.findByEmail(email)
        if(checkRegisteredEmail.data){
            res.status(409)
            res.json({error: "Este email já está cadastrado"})
            return
        }else if(checkRegisteredEmail.status == 500){
            res.status(checkRegisteredEmail.status)
            res.json({error: checkRegisteredEmail.error})
            return
        }

        var validatePasswordFormat = await UserValidate.passwordFormat(password)
        if(validatePasswordFormat.error){
            res.status(validatePasswordFormat.status)
            res.json({error: validatePasswordFormat.error})
            return
        }

        var userCreated = await User.new(name, email, password)
        if(userCreated){
            res.status(userCreated.status)
            res.json({sucess: userCreated.sucess})
            return
        }else{
            res.status(userCreated.status)
            res.json({error: userCreated.error})
            return
        }
    }

    async edit(req, res){
        var id = req.params.id

        if(id != req.dataUserLogged.id){
            res.status(403)
            res.json({error: 'O paramêtro do ID não corresponde ao ID do usuário logado!'})
            return
        }else{
            var {name, email} = req.body

            var validateNameFormat = await UserValidate.nameFormat(name)
            if(validateNameFormat.error){
                res.status(validateNameFormat.status)
                res.json({error: validateNameFormat.error})
                return
            }

            var user = await User.findById(id)
            if(user.data.email != email){
                var validateEmailFormat = await UserValidate.emailFormat(email)
                if(validateEmailFormat.error){
                    res.status(validateEmailFormat.status)
                    res.json({error: validateEmailFormat.error})
                    return
                }

                var checkRegisteredEmail = await User.findByEmail(email)
                if(checkRegisteredEmail.data){
                    res.status(409)
                    res.json({error: "Este email já está cadastrado"})
                    return
                }else if(checkRegisteredEmail.status == 500){
                    res.status(checkRegisteredEmail.status)
                    res.json({error: checkRegisteredEmail.error})
                    return
                }
            }

            var userEdited = await User.update(id, name, email)
            if(userEdited.status == 200){
                res.status(userEdited.status)
                res.json({sucess: userEdited.sucess})
                return
            }else{
                res.status(userEdited.status)
                res.json({error: userEdited.error})
                return
            }
        }
    }

    async delete(req, res){
        var id = req.params.id

        if(id != req.dataUserLogged.id){
            res.status(403)
            res.json({error: 'O paramêtro do ID não corresponde ao ID do usuário logado!'})
            return
        }else{
            var userRemoved = await User.remove(id)
            if(userRemoved.status == 200){
                res.status(userRemoved.status)
                res.json({sucess: userRemoved.sucess})
                return
            }else{
                res.status(userRemoved.status)
                res.json({error: userRemoved.error})
                return
            }
        }
    }

    async recoverPassword(req, res){
        var id = req.params.id

        if(id != req.dataUserLogged.id){
            res.status(403)
            res.json({error: 'O paramêtro do ID não corresponde ao ID do usuário logado!'})
            return
        }else{
            var {email} = req.body

            var validateEmailFormat = await UserValidate.emailFormat(email)
            if(validateEmailFormat.error){
                res.status(validateEmailFormat.status)
                res.json({error: validateEmailFormat.error})
                return
            }

            var user = await UserValidate.emailMatchesUserLogged(id, email)
            if(user.error){
                res.status(user.status)
                res.json({error: user.error})
                return
            }

            var passwordTokenCreated = await PasswordToken.create(user)
            if(passwordTokenCreated.error){
                res.status(passwordTokenCreated.error)
                res.json({error: passwordTokenCreated.error})
                return
            }else{
                try{
                    await SendEmail.tokenNewPassword(user.email, user.name, passwordTokenCreated.token)
                    res.status(200)
                    res.json({sucess: 'O token, de alteração de senha, foi enviado para o seu email com sucesso!'})
                    return
                }catch{
                    res.status(500)
                    res.json({error: 'Ocorreu um erro interno e infelizmente não conseguimos enviar o token, de recuperação de senha, para o seu email!'})
                    return
                }
            }
        }
    }

    async changePassword(req, res){
        var id = req.params.id

        if(id != req.dataUserLogged.id){
            res.status(403)
            res.json({error: 'O paramêtro do ID não corresponde ao ID do usuário logado!'})
            return
        }else{
            var {token, password} = req.body

            var validateToken = await UserValidate.tokenChangePassword(id, token)
            if(validateToken.error){
                res.status(validateToken.status)
                res.json({error: validateToken.error})
                return
            }

            var validatePasswordFormat = await UserValidate.passwordFormat(password)
            if(validatePasswordFormat.error){
                res.status(validatePasswordFormat.status)
                res.json({error: validatePasswordFormat.error})
                return
            }

            var changedPassword = await User.changePassword(password, id, token)
            if(changedPassword.sucess){
                res.status(changedPassword.status)
                res.json({sucess: changedPassword.sucess})
                return
            }else{
                res.status(changedPassword.status)
                res.json({error: changedPassword.error})
                return
            }

        }
    }

    async login(req, res){
        var { email, password } = req.body

        var validateLogin = await UserValidate.login(email, password)
        if(validateLogin.error){
            res.status(validateLogin.status)
            res.json({error: validateLogin.error})
        }else{
            jwt.sign({id: validateLogin.id, email: validateLogin.email}, secret, {expiresIn: '48h'}, (error, token) => {
                if(error){
                    res.status(500)
                    res.json({error: 'Ocorreu um erro interno e infelizmente não foi possível realizar o login do usuário!'})
                    return
                }else{
                    res.status(200)
                    res.json({token: token})
                    return 
                }
            })
        }
    }
}

module.exports = new UserController()