const express = require('express')
var router = express.Router()
let buscaUtiizadores = require('../models/utilizadores')

let mostraUSer = 1; //se utilizador estiver logged in ele mostra o link para fazer logout
let ProcuraUtilizadores;  // quando esta variavel for 1, ira mostrar a card de todos os utilizadores 

let verificaUtilizadorFezLogin = (req, res, next) => {
    if (!req.session.userId) {
        // next()
        res.redirect('/login')
    } else next()
}

router.get('/', verificaUtilizadorFezLogin, (req, res, next) => {
    ProcuraUtilizadores = 0;
    console.log(req.session)
    if (req.session.imagem == null) {
        res.render('index.ejs', {
            UserName: req.session.userName,
            UserImage: 'public/uploads/milos.png',
            mostraUSer : mostraUSer,
            ProcuraUtilizadores : ProcuraUtilizadores
        })
    }else {
        res.render('index.ejs', {
            UserName: req.session.userName,
            UserImage: req.session.imagem,
            mostraUSer : mostraUSer,
            ProcuraUtilizadores: ProcuraUtilizadores
        })
    }
})
router.get('/Utilizadores', verificaUtilizadorFezLogin, (req, res, next) => {
    ProcuraUtilizadores = 1;
    buscaUtiizadores.buscaTodosOsUsers(function(result){
        // console.log(result)
        res.render('index.ejs', {
            UserName: req.session.userName,
            UserImage: req.session.imagem,
            mostraUSer : mostraUSer,
            ProcuraUtilizadores: ProcuraUtilizadores,
            utilizador: result
        })        
    })
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
