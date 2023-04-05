class HomeController {
    async index(req,res){
        res.status(200)
        res.send('API está rodando!')
        return
    }
}

module.exports = new HomeController()