const knex = require('../database/connection')
const bcrypt = require('bcrypt')
const PasswordToken = require('./PasswordToken')

class User {
    async findAll(){
        try{
            var users = await knex.select(["id", "name", "email"]).table("users")
            return {status: 200, data: users}
        }catch(error){
            console.log(error)
            return {status: 500, error: 'Ocorreu um erro interno e infelizmente não terá como retornar os dados dos usuários!'}
        }
    }

    async findById(id){
        try{
            var user = await knex.select(["id", "name", "email"]).where({id: id}).table("users")
            if(user.length > 0){
                return {status: 200, data: user[0]}
            }else{
                return {status: 404, error: 'ID do usuário não encontrado no banco de dados'}
            }
        }catch(error){
            console.log(error)
            return {status: 500, error: 'Ocorreu um erro interno e infelizmente não terá como retornar os dados do usuário!'}
        }
    }

    async findByEmail(email){
        try{
            var user = await knex.select(["id", "name", "email", "password"]).where({email: email}).table("users")
            
            if(user.length > 0){
                return {status: 200, data: user[0]}
            }else{
                return {status: 404, error: 'Email não cadastrado!'}
            }
        }catch(error){
            console.log(error)
            return {status: 500, error: 'Ocorreu um erro interno e infelizmente não conseguimos verificar se o email está cadastrado no banco de dados!'}
        }
    }

    async new(name, email, password){
        try{
            var hash = await bcrypt.hash(password, 10)
            await knex.insert({name, email, password: hash}).table('users')
            return {status: 200, sucess: 'Usuário cadastrado com sucesso!'}
        }catch(error){
            console.log(error)
            return {status: 500, error: 'Ocorreu um erro interno e infelizmente não foi possível cadastrar o usuário!'}
        }
    }

    async update(id, name, email){
        try{
            await knex.update({name, email}).where({id: id}).table('users')
            return {status: 200, sucess: 'Os dados do usuário foram editados com sucesso!'}
        }catch(error){
            console.log(error)
            return {status: 500, error: 'Ocorreu um erro interno e infelizmente não foi possível editar os dados do usuário!'}
        }
    }

    async remove(id){
        try{
            await knex.delete().where({id: id}).table('users')
            return {status: 200, sucess: 'Usuário deletado com sucesso!'}
        }catch(error){
            console.log(error)
            return {status: 500, error: 'Ocorreu um erro interno e infelizmente não conseguimos deletar o usuário!'}
        }
    }

    async changePassword(newPassword, id, token){
        try{
            var hash = await bcrypt.hash(newPassword, 10)
            await knex.update({password: hash}).where({id: id}).table('users')
            await PasswordToken.setUsed(token)
            return {status: 200, sucess: 'Senha alterada com sucesso!'}
        }catch(error){
            console.log(error)
            return {status: 500, error: 'Ocorreu um erro interno e infelizmente não foi possível alterar a senha!'}
        }
    }
}

module.exports = new User()