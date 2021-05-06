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

async function criarCHAT(id, nameChat ,membros, callback) {
    
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
    _chat['status'] = 'pending_to_be_accepted'

    result2 = await dbo.collection("Utilizadores").updateOne({
        _id: new ObjectID(id)

    }, {
        $push: {
            chat: _chat
        }
    })

    result.push(result2)

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
    await findNameConversa(nomeChat, async function (result) {
        console.log(result)
        mensagens = await result.conversas
        let item = {}
        item["user_id"] = id,
            item["data"] = data
        mensagens.push(item)
    })

}

module.exports = {
    criarCHAT,
    buscaChat,
    findNameConversa,
    findIdChat,
    insereMensagem
}