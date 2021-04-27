const express = require('express')
var router = express.Router()

let verificaUtilizadorFezLogin = (req, res, next) => {
    if (!req.session.userId) {
        // next()
        res.redirect('/login')
    } else 
        next()
}

router.get('/', verificaUtilizadorFezLogin, (req, res, next) => {
    var mostraUSer = 1;
    console.log(req.session)
    if (req.session.imagem == null) {
        res.render('index.ejs', {
            UserName: req.session.userName,
            UserImage: 'public/uploads/milos.png',
            mostraUSer : mostraUSer
        })
    }else {
        res.render('index.ejs', {
            UserName: req.session.userName,
            UserImage: req.session.imagem,
            mostraUSer : mostraUSer
        })
    }
})

router.get('/logout', verificaUtilizadorFezLogin, (req, res, next) => {
    req
        .session
        .destroy(err => {
            if (err) 
                return res.redirect('/')

            res.clearCookie("sessionMilos")
            console.log("o user fez logout")
            return res.redirect('/login')

        })

})
module.exports = router
