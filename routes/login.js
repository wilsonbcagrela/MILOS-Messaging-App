const express = require('express')
var router = express.Router()
const loginUser = require('../models/utilizadores')
const bcrypt = require('bcrypt')

let redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/')
    } else 
        next()
}

router.get('/', redirectHome, (req, res, next) => {
    console.log(req.session)
    var erro = 0
    res.render('login.ejs', {erro: erro})

})
router.post('/', (req, res, next) => {

    loginUser.loginUser(
        req.body.userName,
        req.body.userPassword,
        function (result) {

            if (result) {
                req.session.userId = result._id
                req.session.userName = result.name
                req.session.imagem = result.image
                return res.redirect("/")
            } else {
                var erro = 1
                return res.render('login.ejs', {erro: erro})
            }

        }
    )

})

module.exports = router