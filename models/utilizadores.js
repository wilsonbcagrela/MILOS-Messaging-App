var MongoClient = require('mongodb').MongoClient
let ObjectID = require('mongodb').ObjectID
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
        .findOne({
            name: nome
        })
}

async function __findNAME(nome, callback) {
    return await callback(dbo
        .collection("Utilizadores")
        .findOne({
            name: nome
        }))
}


async function findID(id, callback) {
    let ObjectID = require('mongodb').ObjectID
    let find = await dbo.collection("Utilizadores").findOne({
        _id: new ObjectID(id)
    })
    return callback(find)
}

async function add_friends_req(id_quem_pede, nome, callback) {
    let amigos_pendentes = []
    await findID(id_quem_pede, async function (result) {
        let erro = false
        amigos_pendentes = await result.friends.amigos_pendentes
        var BreakException = {}
        let id_destinatario = await findNAME(nome)
        let _amigos_pend_destinatario = id_destinatario.friends.amigos_pendentes

        try {
            let temp1 = id_destinatario._id
            await amigos_pendentes.forEach(element => {
                let temp2 = element.id_destinatario
                if (temp2.toString() == temp1.toString())
                    throw BreakException
                temp2 = element.id_origem
                if (temp2.toString() == id_quem_pede)
                    throw BreakException
            })

            let item = {}
            item["id_destinatario"] = new ObjectID(id_destinatario._id),
            item["name"] = id_destinatario.name,
            item["status"] = "waiting_accepted"
            amigos_pendentes.push(item)
            item = {}
            item["id_origem"] = new ObjectID(id_quem_pede),
            item["name"] = result.name,
            item["status"] = "to_be_accepted"
            _amigos_pend_destinatario.push(item)


            let __result = []

            let update1 = await dbo.collection("Utilizadores").updateMany({
                _id: new ObjectID(id_quem_pede)
            }, {
                $set: {
                    "friends.amigos_pendentes": amigos_pendentes
                }
            })

            __result.push(await update1.result.ok)

            let update2 = await dbo.collection("Utilizadores").updateMany({
                _id: new ObjectID(id_destinatario._id)
            }, {
                $set: {
                    "friends.amigos_pendentes": _amigos_pend_destinatario
                }
            })

            __result.push(await update2.result.ok)

            return callback(__result)

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
                                amigos_pendentes: []
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