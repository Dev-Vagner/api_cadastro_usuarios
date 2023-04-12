const express = require("express")
const router = express.Router()
const HomeController = require('../controllers/HomeController')
const UserController = require("../controllers/UserController")
const UserLogged = require('../middleware/UserLogged')

router.get('/', HomeController.index) // OK
router.post('/user', UserController.create) //OK
router.get('/users', UserLogged, UserController.findAllUsers)
router.get('/user/:id', UserLogged, UserController.findUser) //OK
router.put('/user/:id', UserLogged, UserController.edit) //OK
router.delete('/user/:id', UserLogged, UserController.delete)
router.post('/passwordToken/:userId', UserLogged, UserController.sendPasswordToken) //OK
router.put('/password/:userId', UserLogged, UserController.changePassword)
router.post('/login', UserController.login) //OK

module.exports = router