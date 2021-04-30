var MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
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

async function findNAME(nome) {
    return await dbo
        .collection("Utilizadores")
        .findOne({name: nome})
}

async function __findNAME(nome, callback) {
    return await callback(dbo
        .collection("Utilizadores")
        .findOne({name: nome}))
}


async function findID(id, callback) {
    let ObjectID = require('mongodb').ObjectID
    let find = await dbo.collection("Utilizadores").findOne({_id: new ObjectID(id)})
    return callback(find)
}

async function add_friends_req(id_quem_pede, nome, callback) {
    let amigos_pendentes = []
    await findID(id,async function (result) {
        let erro = false
        //amigos_pendentes = result.friends_pendentes
        var BreakException = {};

        try {
            /*await amigos.forEach(element => {
                if (element.name == nome) 
                    throw BreakException
            })*/
    

            let item = {}
            item["name"] = nome,
            item["status"] = "waiting_accepted"
            console.log("ola "+ JSON.stringify(item))
            amigos_pendentes.push(item)

            let ObjectID = require('mongodb').ObjectID
            __id = new ObjectID(id_quem_pede)

            return callback(dbo.collection("Utilizadores").updateOne({
                _id: __id
            }, {
                $set: {
                    "friends.amigos_pendentes": amigos_pendentes
                    },
                }
            ))

        } catch (e) {
                erro = true
                return callback(erro)
               
        }

        
    
    })

}

async function insertUtilizador(nome, password, conPassword, img, callback) {

    const saltRounds = 10
    let _find = await findNAME(nome)

    if (password == conPassword) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {

                if (_find == null) {
                    dbo
                        .collection("Utilizadores")
                        .insertOne({
                            name: nome,
                            password: hash,
                            image: img,
                            chat: [],
                            friends: {
                                amigos: [],
                                amigos_pendentes: [],
                                amigos_bloqueados: []
                            },
                        }, function (err, res) {
                            if (err) 
                                throw err
                            console.log("Foi registado com sucesso :-D")
                        })
                    return callback(true)
                }
                return callback(false)

            })
        })
    } else 
        return callback(false)
}

async function loginUser(nome, password, callback) {
    let find = await findNAME(nome)
    if (find !== null) {
        bcrypt.compare(password, find.password, function (err, result) {
            if (err) 
                console.log(err)
            if (result) {
                console.log("palavra passe certa")
                return callback(find)
            } else {
                console.log("palavra passe errada")
                return callback(false)
            }
        })
    } else {
        return callback(false)
    }
}

function buscaTodosOsUsers(callback) {
    dbo
        .collection("Utilizadores")
        .find({})
        .toArray(function (err, result) {
            return callback(result)
        });
}

module.exports = {
    insertUtilizador,
    loginUser,
    buscaTodosOsUsers,
    findID,
    __findNAME,
    add_friends_req
}