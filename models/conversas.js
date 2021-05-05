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

async function criarCHAT(nameChat, utilizarAdmin, callback) {
    dbo
        .collection("Conversas")
        .insertOne({ 
            nome: nameChat,
            membros: [utilizarAdmin],
            conversas: []
        })
    return callback(true)
}
async function buscaChat(callback){
    dbo 
        .collection("Conversas")
        .find().toArray(function(err, result){
            if(err) throw err;
            return callback(result)
        });
}
async function findIdChat(id, callback) {
    let find = await dbo.collection("Conversas").findOne({
        _id: new ObjectID(id)
    })
    return callback(find)
}
async function findNameConversa(nomeChat, callback) {
    return await callback(dbo
        .collection("Conversas")
        .findOne({
            nome: nomeChat
        }))
}
module.exports = {
    criarCHAT,
    buscaChat,
    findNameConversa,
    findIdChat
}