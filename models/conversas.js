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

async function criarCHAT(userID, nameCHAT, userName, callback) {
    dbo
        .collection("Conversas")
        .insertOne({
            usersID: [userID],  //inicialmente fica so o user que cria o chat, depois os outros entram ao aceitar o convite 
            nameCHAT: nameCHAT,
            userName: [userName],
            mensagens: []
        })
    return callback(true)
}


module.exports = {
    criarCHAT
}