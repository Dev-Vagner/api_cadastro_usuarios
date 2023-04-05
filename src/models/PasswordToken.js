const knex = require('../database/connection')
const { v4: uuidv4 } = require('uuid')

class PasswordToken {
    async create(user){
        try{
            var token = uuidv4()
            await knex.insert({
                token: token,
                user_id: user.id,
                used: 0
            }).table('passwordtokens')
            return {status: 200, token: token}
        }catch(error){
            console.log(error)
            return {status: 500, error: 'Ocorreu um erro interno e infelizmente não foi possível criar o token para a alteração de senha!'}
        }   
    }

    async validate(userId, token){
        try{
            var checkedToken = await knex.select().where({token: token}).table('passwordtokens')
            if(checkedToken.length > 0){
                var tokenExist = checkedToken[0]
                if(tokenExist.user_id != userId){
                    return {status: 403, error: 'Este token não é válido para este usuário!'}
                }else if(tokenExist.used){
                    return {status: 403, error: 'Este token já foi utilizado!'}
                }else{
                    return {status: 200, sucess: 'Token válido!'}
                }
            }else{
                return {status: 404, error: 'Token inválido!'}
            }
        }catch(error){
            console.log(error)
            return {status: 500, error: 'Ocorreu um erro interno e infelizmente não foi possível verificar se este token é válido!'}
        }
    }

    async setUsed(token){
        await knex.update({used: 1}).where({token: token}).table('passwordtokens')
    }
}

module.exports = new PasswordToken()