const express = require('express')
var router = express.Router()
let buscaUtiizadores = require('../models/utilizadores')
let buscaConversas = require('../models/conversas')
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


router.post('/abrir_conversa', verificaUtilizadorFezLogin, async (req, res, next) => {

    let chat_id = []
    let resposta
    await buscaUtiizadores.findID(req.session.userId, async function (find) {
        chat_id = await find.chat
    })

    for (let index = 0; index < chat_id.length; index++) {
        if (chat_id[index].id == req.body.id) {
            resposta = chat_id[index]
            break
        }
    }

    //console.log(resposta)
    res.json(resposta)

})

router.post('/lista_chat', verificaUtilizadorFezLogin, async (req, res, next) => {

    let chat_id
    let resposta = []

    await buscaUtiizadores.findID(req.session.userId, async function (find) {
        chat_id = await find.chat
    })

    for (let index = 0; index < chat_id.length; index++) {
        await buscaConversas.findIdChat(chat_id[index].id, async function (find) {
            let list = {}
            list['id'] = await find._id,
                list['nome'] = await find.nome
            resposta.push(list)
        })
    }
    res.json(resposta)

})

router.post('/lista_amigos', verificaUtilizadorFezLogin, async (req, res, next) => {
    await buscaUtiizadores.findID(req.session.userId, async function (find) {
        let _find = await find.friends.amigos
        let nomes = []
        for (let index = 0; index < _find.length; index++) {
            await buscaUtiizadores.findID(_find[index], async function (find) {
                let item = {}
                item["id"] = find._id,
                    item["name"] = find.name
                nomes.push(item)
            })
        }
        res.json(nomes)
    })
})

async function _cache(cache, temp,){
    let pesquisar = true
    if(cache.has(temp.owner.toString())){
        temp.owner = cache.get(temp.owner.toString())
        pesquisar = false
    }
    return pesquisar
}

router.post('/lista_mensagens', verificaUtilizadorFezLogin, async (req, res, next) => {
    await buscaConversas.findIdChat(req.body.id, async function (result) {
        let temp = result.conversas
        var cache = new Map()
        for (let index = 0; index < temp.length; index++) {
            let pesquisar = await _cache(cache,temp[index])
            if (pesquisar) {
                await buscaUtiizadores.findID(temp[index].owner, async function (_result) {
                    cache.set(temp[index].owner.toString(), _result.name)
                    temp[index].owner = _result.name
                })
            }
        }
        res.json(temp)
    })
})

router.post('/aceitar_conv_conversa', verificaUtilizadorFezLogin, (req, res, next) => {

    buscaConversas.aceitar_conv_conversa(req.session.userId, req.body.id, async function (result) {
        res.json(result)
    })

})

router.post('/rejeitar_conv_conversa', verificaUtilizadorFezLogin, (req, res, next) => {

    buscaConversas.rejeitar_conv_conversa(req.session.userId, req.body.id, async function (result) {
        res.json(result)
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
                var img = (find.image == null) ? 'public/uploads/milos.png' : find.image
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
    try {
        await buscaUtiizadores.findID(req.session.userId, function (find) {
            let _find = find.friends.amigos_pendentes
            res.json(_find.length)
        })
    } catch (e) {
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

router.post('/criaChat', verificaUtilizadorFezLogin, (req, res, next) => {
    let membros = (req.body.membros == undefined) ? [] : req.body.membros
    console.log(membros)
    buscaConversas.criarCHAT(req.session.userId, req.body.nome, membros, async function (result) {
        console.log(result)
        console.log(req.body.nome)
        res.json(await result)
    })
})
router.post('/atualizaChat', verificaUtilizadorFezLogin, (req, res, next) => {
    let membros = (req.body.membros == undefined) ? [] : req.body.membros
    console.log(membros)
    console.log(req.body.id)
    buscaConversas.atualizaCHAT(req.session.userId, req.body.nome, membros, req.body.id, async function (result) {
        console.log(result)
        
        res.json(await result)
    })
})
router.post('/guardaMensagem', verificaUtilizadorFezLogin, (req, res, next) => {
    buscaConversas.insereMensagem(req.session.userId, req.body, async function (result) {
        res.json(await result)
    })
})

module.exports = router