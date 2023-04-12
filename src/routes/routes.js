const express = require("express")
const router = express.Router()
const HomeController = require('../controllers/HomeController')
const UserController = require("../controllers/UserController")
const UserLogged = require('../middleware/UserLogged')

router.get('/', HomeController.index) // OK
router.post('/user', UserController.create) //OK
router.get('/users', UserLogged, UserController.findAllUsers)
router.get('/user/:id', UserLogged, UserController.findUser)
router.put('/user/:id', UserLogged, UserController.edit)
router.delete('/user/:id', UserLogged, UserController.delete)
router.post('/recoverpassword/:id', UserLogged, UserController.recoverPassword)
router.post('/changepassword/:id', UserLogged, UserController.changePassword)
router.post('/login', UserController.login)

module.exports = router