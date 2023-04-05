const jwt = require('jsonwebtoken')
const secret = process.env.PASSWORD_JWT

module.exports = function(req, res, next){
    
    const authToken = req.headers['authorization']

    if(authToken != undefined){

        const bearer = authToken.split(' ')
        var token = bearer[1]
        try{
            jwt.verify(token, secret, (error, data) => {
                if(error){
                    res.status(403)
                    res.json({error: 'Você não está autenticado!'})
                    return
                }else{
                    req.token = token
                    req.dataUserLogged = {id: data.id, name: data.name, email: data.email}
                    next()
                }
            })
        }catch(error){
            res.status(403)
            res.json({error: 'Você não está autenticado!'})
            return
        }

    }else{
        res.status(403)
        res.json({error: 'Você não está autenticado!'})
        return
    }
}