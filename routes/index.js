const express = require('express')

var router = express.Router()
let buscaUtiizadores = require('../models/utilizadores')

let mostraUSer //se utilizador estiver logged in ele mostra o link para fazer logout
let ProcuraUtilizadores // quando esta variavel for 1, ira mostrar a card de todos os utilizadores


let verificaUtilizadorFezLogin = (req, res, next) => {
    if (!req.session.userId) {
        mostraUSer = 0
        return res.redirect('/login')
    }
    mostraUSer = 1
    return next()
}

router.get('/', verificaUtilizadorFezLogin, (req, res, next) => {
    ProcuraUtilizadores = 0
    console.log(req.session)
    if (req.session.imagem == null) {
        return res.render('index.ejs', {
            UserName: req.session.userName,
            UserImage: 'public/uploads/milos.png',
            mostraUSer: mostraUSer,
            ProcuraUtilizadores: ProcuraUtilizadores
        })
    }
    return res.render('index.ejs', {
        UserName: req.session.userName,
        UserImage: req.session.imagem,
        mostraUSer: mostraUSer,
        ProcuraUtilizadores: ProcuraUtilizadores
    })
})

router.get('/Utilizadores', verificaUtilizadorFezLogin, (req, res, next) => {
    ProcuraUtilizadores = 1
    buscaUtiizadores.buscaTodosOsUsers(function (result) {
        return res.render('index.ejs', {
            UserName: req.session.userName,
            UserImage: req.session.imagem,
            mostraUSer: mostraUSer,
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

router.post('/lista_chat', verificaUtilizadorFezLogin, (req, res, next) => {
    
    return res.json("ola")

})

router.post('/lista_amigos', verificaUtilizadorFezLogin, (req, res, next) => {
    buscaUtiizadores.findID(req.session.userId, function (find) {
        return res.json(find.friends)
    })    
})

router.post('/add_amigos', verificaUtilizadorFezLogin, (req, res, next) => {
    buscaUtiizadores.add_friends(req.session.userId,req.body.name, function (result) {
        return  res.json(result.result)
    })
    
})

router.post('/find_friends', verificaUtilizadorFezLogin, (req, res, next) => {

    let nome = []
    buscaUtiizadores.buscaTodosOsUsers(async function (result) {
        await result.forEach(element => {
            if(element.name.includes(req.body.friends)){
                let item = {}
                item ["name"] = element.name
                nome.push(item)
            }
        })
        return res.json(nome)
    })
    
})



module.exports = router
