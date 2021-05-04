var MongoClient = require('mongodb').MongoClient

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

async function criarCHAT(nameChat, callback) {
    dbo
        .collection("Conversas")
        .insertOne({ 
            nome: nameChat,
            membros: [],
            conversas: []
        })
    return callback(true)
}
async function buscaMensagens(NameChat){
    dbo 
        .collection("Conversas")
        .find().toArray(function(err, result){
            if(err) throw err;

        });
}
module.exports = {
    criarCHAT
}