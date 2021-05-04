const express = require('express')
var router = express.Router()
let buscaUtiizadores = require('../models/utilizadores')
crypto = require('crypto')

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

router.post('/lista_amigos', verificaUtilizadorFezLogin, async (req, res, next) => {
    await buscaUtiizadores.findID(req.session.userId, async function (find) {
        let _find = await find.friends.amigos
        let nomes = []
        for (let index = 0; index < _find.length; index++) {
            await buscaUtiizadores.findID(_find[index] , async function (find) {
                let item = {}
                item["id"] = find._id,
                item["name"] = find.name
                nomes.push(item)
            })
        }
        res.json(nomes)
    })
})

router.post('/add_amigos', verificaUtilizadorFezLogin, (req, res, next) => {
    buscaUtiizadores.add_friends_req(req.session.userId, req.body.name, async function (result) {
        console.log(result)
        res.json(await result)
    })

})

router.post('/pedidos_pendentes', verificaUtilizadorFezLogin, async (req, res, next) => {
    await buscaUtiizadores.findID(req.session.userId, async function (find) {
        let _find = await find.friends.amigos_pendentes
        let __result = []
        for (let index = 0; index < _find.length; index++) {
            await buscaUtiizadores.findID(_find[index].id, function (find) {
                var img = (find.image == null) ? './uploads/milos.png' : find.image
                let item = {}
                item["id"] = _find[index].id,
                    item["name"] = find.name,
                    item["img"] = img,
                    item["status"] = _find[index].status
                __result.push(item)
            })
        }
        res.json(__result)
    })
})

router.post('/pedidos_pendentes_count', verificaUtilizadorFezLogin, async (req, res, next) => {
    try{
        await buscaUtiizadores.findID(req.session.userId, function (find) {
            let _find = find.friends.amigos_pendentes
            res.json(_find.length)
        })
    }catch (e) {
        console.log(e)
      }
})

router.post('/rejeitar_pedido_de_amizade', verificaUtilizadorFezLogin, async (req, res, next) => {
    await buscaUtiizadores.eliminar_pedido_de_amizade(req.session.userId, req.body.id, async (result) => {
        console.log(result)
        res.json(true)
    })
})

router.post('/aceitar_pedido_de_amizade', verificaUtilizadorFezLogin, async (req, res, next) => {
    await buscaUtiizadores.aceitar_pedido_de_amizade(req.session.userId, req.body.id, async (result) => {
        console.log(result)
        res.json(true)
    })
})

router.post('/apagar_amigo', verificaUtilizadorFezLogin, async (req, res, next) => {
    await buscaUtiizadores.apagar_amigo(req.session.userId, req.body.id, async (result) => {
        console.log(result)
        res.json(true)
    })
})

router.post('/find_friends', verificaUtilizadorFezLogin, (req, res, next) => {
    let nome = []
    buscaUtiizadores.buscaTodosOsUsers(async function (result) {
        await result.forEach(async element => {
            if (element._id != req.session.userId) {
                if (element.name.includes(req.body.friends)) {

                    let gravar = true
                    let temp = element.friends.amigos_pendentes
                    let temp2 = element.friends.amigos

                    for (let index = 0; index < temp.length; index++) {
                        if (temp[index].id == req.session.userId)
                            gravar = false
                    }

                    for (let index = 0; index < temp2.length; index++) {
                        if (temp2[index] == req.session.userId)
                            gravar = false
                    }

                    if (gravar) {
                        let item = {}
                        item["name"] = element.name
                        nome.push(item)
                    }

                }
            }
        })
        return res.json(nome)
    })
})



module.exports = router