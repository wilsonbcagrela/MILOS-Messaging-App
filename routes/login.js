const express = require('express')
var router = express.Router()
const loginUser = require('../models/utilizadores')
const bcrypt = require('bcrypt')

let redirectHome = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/')
    }
    return next()
}

router.get('/', redirectHome, (req, res, next) => {
    console.log(req.session)
    var erro = 0;
    var mostraUSer = 0;
    return res.render('login.ejs', {erro: erro, mostraUSer: mostraUSer })

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