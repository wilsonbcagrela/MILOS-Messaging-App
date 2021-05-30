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
            UserImage: '/uploads/milos.png',
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
            console.log(list)
            resposta.push(list)
        })
    }

    res.json(resposta)

})
router.post('/verifica_dono', verificaUtilizadorFezLogin, async (req, res, next) => {
    let resposta = []
    await buscaConversas.findIdChat(req.body.id, async function (find) {
        let list = {}
        if(find.owner == req.session.userId){
            list['dono'] = true
        }else{
            list['dono'] = false
        }
        resposta.push(list)
    })
    console.log(resposta)
    res.json(resposta)
})
router.post('/sairchat', verificaUtilizadorFezLogin, async (req, res, next) => {
    await buscaConversas.SairConversa(req.session.userId,req.body.id )
    res.json("yoo")
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
router.post('/verificaSeAmigoEstaNaConversa', verificaUtilizadorFezLogin, async (req, res, next) => {

    let amigos
    let amigosNaConversa
    let amigosNaConversaString
    let amigosNomes = []
    let item
    await buscaUtiizadores.findID(req.session.userId, async function (find) {
        amigos = await find.friends.amigos
    })
    console.log(amigos)
    console.log(req.body.id)

    await buscaConversas.findIdChat(req.body.id, async function (find){
        amigosNaConversa = await find.membros
    })
    console.log(JSON.stringify(amigosNaConversa))
    amigosNaConversaString = JSON.stringify(amigosNaConversa)

    for (let index = 0; index < amigos.length; index++) {

        if(amigosNaConversa.length != 0){
            let amigosString = JSON.stringify(amigos[index])

            if(!amigosNaConversaString.includes(amigosString)){
                console.log(amigosNaConversaString.includes(amigosString))

                await buscaUtiizadores.findID(amigos[index], async function (find) {
                    item = {}
                    item["id"] = find._id,
                    item["name"] = find.name
                    amigosNomes.push(item)
                })
            }

        }else{
            console.log(index)
            await buscaUtiizadores.findID(amigos[index], async function (find) {
                item = {}
                item["id"] = find._id,
                item["name"] = find.name
                amigosNomes.push(item)
            })
            
        }
    }
    console.log(amigosNomes)
    res.json(amigosNomes)

})
router.post('/amigosNaConversa', verificaUtilizadorFezLogin, async (req, res, next) => {
    let amigos
    let amigosNaConversa = []
    let item
    await buscaConversas.findIdChat(req.body.id, async function (find){
        amigos = await find.membros
    })
    for (let index = 0; index < amigos.length; index++) {
        await buscaUtiizadores.findID(amigos[index], async function (find) {
            item = {}
            item["id"] = find._id,
            item["name"] = find.name
            amigosNaConversa.push(item)
        })
    }
    res.json(amigosNaConversa)
})
router.post('/ApagaChat', verificaUtilizadorFezLogin, async (req, res, next) => {
    let amigosNaConversa
    await buscaConversas.findIdChat(req.body.id, async function (find){
        amigosNaConversa = await find.membros
    })
    buscaConversas.ApagaConversa(req.session.userId, amigosNaConversa ,req.body.id)

    res.json("success")
})

async function _cache(cache, temp){
    let pesquisar = true
    if(cache.has(temp.owner.toString())){
        let result = cache.get(temp.owner.toString())
        temp.owner = result.name
        temp.image_owner = result.image
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
                    if(_result.image != null){
                        console.log(_result.image)
                        cache.set(temp[index].owner.toString(), {name: _result.name, image: _result.image})
                        temp[index].owner = _result.name
                        temp[index].image_owner = _result.image
                    }
                    else{
                        cache.set(temp[index].owner.toString(), {name: _result.name, image: "/uploads/milos.png"})
                        temp[index].owner = _result.name
                        temp[index].image_owner = "/uploads/milos.png"
                    }
                        
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
                var img = (find.image == null) ? '/uploads/milos.png' : find.image
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

    buscaConversas.atualizaCHAT(req.session.userId, req.body.nome, membros, req.body.id, async function (result) {

        res.json(await result)
    })
})

router.post('/guardaMensagem', verificaUtilizadorFezLogin, async (req, res, next) => {
    await buscaConversas.insereMensagem(req.session.userId, req.body, async function (result) {
        console.log(await result)
    })
    await buscaUtiizadores.findID(req.session.userId, async function (find) {
        console.log(find)
        if(find.image != null)
            res.json({name: find.name, image: `"/uploads/${find.image}"`})
        else
            res.json({name: find.name, image: "/uploads/milos.png"})
    })
    
})

router.post('/envia_votacao', verificaUtilizadorFezLogin, async (req, res, next) => {
    await buscaConversas.insereVoting(req.session.userId, req.body, async function (result) {
        console.log(await result)
    })
    await buscaUtiizadores.findID(req.session.userId, async function (find) {
        console.log(find)
        if(find.image != null)
            res.json({name: find.name, image: `"/uploads/${find.image}"`})
        else
            res.json({name: find.name, image: "/uploads/milos.png"})
    })
    
})

module.exports = router