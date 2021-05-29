var MongoClient = require('mongodb').MongoClient
let ObjectID = require('mongodb').ObjectID

const url = "mongodb+srv://G8:8xKieDpip2IgbQad@clusterdbw.1dbjr.mongodb.net/G8?authSource=a" +
    "dmin&replicaSet=atlas-bek8xj-shard-0&w=majority&readPreference=primary&appname" +
    "=MongoDB%20Compass&retryWrites=true&ssl=true"

let dbo
MongoClient.connect(url, {
    useUnifiedTopology: true
}, function (err, db) {
    if (err)
        throw err
    dbo = db.db("G8")
})

async function aceitar_conv_conversa(id, id_conversa, callback) {


    let result = []

    result1 = await dbo.collection("Utilizadores").updateOne({
        _id: new ObjectID(id)
    }, {
        $pull: {
            "chat": {
                "id": new ObjectID(id_conversa)
            }
        }
    })

    result.push(result1.result)

    let result2 = await dbo.collection("Utilizadores").updateOne({
        _id: new ObjectID(id)
    }, {
        $push: {
            "chat": {
                "id": new ObjectID(id_conversa),
                "status": "accepted"
            }
        }
    })

    result.push(result2.result)

    console.log(result)
    return callback(result)
}

async function rejeitar_conv_conversa(id, id_conversa, callback) {
    let result = await dbo.collection("Utilizadores").updateOne({
        _id: new ObjectID(id)
    }, {
        $pull: {
            "chat": {
                "id": new ObjectID(id_conversa)
            }
        }
    })

    console.log(result.result)
    return callback(result.result)
}
async function atualizaCHAT(id, nameChat, membros,idConversa, callback) {
    let result = []
     
    result1 = await dbo
        .collection("Conversas")
        .updateOne({
            _id: new ObjectID(idConversa)
    
        }, {
            $set: {
                nome: nameChat
            },
            $push: {
                membros: membros
            }
       
        })

    result.push(result1)

    if (membros.length > 0) {

        _membros = []
        membros.forEach(element => {
            _membros.push(new ObjectID(element))
        })

        __chat = {}
        __chat['id'] = new ObjectID(idConversa),
        __chat['status'] = 'pending_to_be_accepted'

        result2 = await dbo.collection("Utilizadores").updateOne({
            _id: {
                $in: _membros
            }

        }, {
            $push: {
                chat: __chat
            }
        })

        result.push(result2)


    }

    return callback(true)
}
async function criarCHAT(id, nameChat, membros, callback) {

    let result = []

    result1 = await dbo
        .collection("Conversas")
        .insertOne({
            nome: nameChat,
            owner: new ObjectID(id),
            membros: membros,
            conversas: []
        })

    result.push(result1)

    let _chat = {}
    _chat['id'] = new ObjectID(result1.ops[0]._id),
    _chat['status'] = 'accepted'
    //_chat['status'] = 'pending_to_be_accepted'

    result2 = await dbo.collection("Utilizadores").updateOne({
        _id: new ObjectID(id)

    }, {
        $push: {
            chat: _chat
        }
    })

    result.push(result2)

    if (membros.length > 0) {

        _membros = []
        membros.forEach(element => {
            _membros.push(new ObjectID(element))
        })

        _chat = {}
        _chat['id'] = new ObjectID(result1.ops[0]._id),
            _chat['status'] = 'pending_to_be_accepted'

        result3 = await dbo.collection("Utilizadores").updateOne({
            _id: {
                $in: _membros
            }

        }, {
            $push: {
                chat: _chat
            }
        })

        result.push(result3)


    }

    return callback(true)
}
async function buscaChat(callback) {
    dbo
        .collection("Conversas")
        .find().toArray(function (err, result) {
            if (err) throw err;
            return callback(result)
        })
}
async function findIdChat(id, callback) {
    let find = await dbo.collection("Conversas").findOne({
        _id: new ObjectID(id)
    })
    return callback(find)
}
async function findNameConversa(nomeChat, callback) {
    let resultado = await dbo
        .collection("Conversas")
        .findOne({
            nome: nomeChat
        })
    return callback(resultado)
}
async function insereMensagem(id, data, callback) {
    let mensagens
    console.log(data.id)

    let resultado = await dbo
        .collection("Conversas")
        .updateOne({
            _id: new ObjectID(data.id)
        }, {
            $push: {
                conversas:{
                    owner: ObjectID(id),
                    date: new Date().toLocaleTimeString(),
                    message: data.message,
                    votacao: null
                }
            }
        })
    
    callback(resultado.result)
}
async function ApagaConversa(id, membros, idConversa) {
    let result = []
    let resultado = await dbo
        .collection("Conversas")
        .deleteOne({
            _id: new ObjectID(idConversa)
        })
    result.push(resultado)
    _chat = {}
    _chat['id'] = new ObjectID(idConversa)
    _chat['status'] = 'accepted'

    let resultado2 = await dbo.collection("Utilizadores").updateOne({
        _id: new ObjectID(id)
    
        }, {
            $pull: {
                "chat": {
                    "id": new ObjectID(idConversa)
                }
            }
        })
    result.push(resultado2)

    _membros = []

    membros.forEach(element => {

        _membros.push(new ObjectID(element))

    })
    let resultado3 = await dbo.collection("Utilizadores").updateOne({
        _id: {
            $in: _membros
        }

    }, {
        $pull: {
            "chat": {
                "id": new ObjectID(idConversa)
            }
        }
    })

    result.push(resultado3)
    // callback(true)
}
async function insereVoting(id, data, callback) {
    let resultado = await dbo
        .collection("Conversas")
        .updateOne({
            _id: new ObjectID(data.id)
        }, {
            $push: {
                conversas:{
                    owner: ObjectID(id),
                    date: new Date().toLocaleTimeString(),
                    message: null,
                    votacao: data.voting
                }
            }
        })
    
    callback(resultado.result)
}

module.exports = {
    criarCHAT,
    buscaChat,
    findNameConversa,
    findIdChat,
    insereMensagem,
    aceitar_conv_conversa,
    rejeitar_conv_conversa,
    atualizaCHAT,
    ApagaConversa,
    insereVoting
}