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

async function criarCHAT(userID, nameCHAT, conversas, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) 
            throw err
        var dbo = db.db("G8")
        dbo
            .collection("Conversas")
            .insertOne({
                name: nome,
                password: password,
                image: img
            }, function (err, res) {
                if (err) 
                    throw err
                console.log("Foi registado com sucesso :-D")
                db.close()
            })
    })
}