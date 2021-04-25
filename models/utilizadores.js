var MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
var url = "mongodb+srv://G8:8xKieDpip2IgbQad@clusterdbw.1dbjr.mongodb.net/G8?authSource=admin&replicaSet=atlas-bek8xj-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"

let dbo
MongoClient.connect(url, {useUnifiedTopology: true },function(err, db) {
  if (err) throw err
    dbo = db.db("G8")
})

async function findNAME (nome) {
  return await dbo.collection("Utilizadores").findOne({name : nome})
}

async function insertUtilizador(nome, password, conPassword, img, callback){

  const saltRounds = 10
  let _find = await findNAME(nome)

  if(password == conPassword){
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        
        if(_find == null) {
          dbo.collection("Utilizadores").insertOne({name:nome,password:hash,image:img}, function(err, res) {
            if (err) throw err
            console.log("Foi registado com sucesso :-D")
          })
          return callback(true)
        }
        return callback(false)

      })
    })
  } else return callback(false)
}

async function loginUser(nome, password, callback){
    let find = await findNAME(nome)
    if(find !== null){ 
      bcrypt.compare(password, find.password, function(err, result) {
          if (err) console.log(err)
          if(result) {
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

function criarCHAT(userID,nameCHAT,conversas,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err
    var dbo = db.db("G8")
    dbo.collection("Utilizadores").insertOne({name:nome,password:password,image:img}, function(err, res) {
      if (err) throw err
      console.log("Foi registado com sucesso :-D")
      db.close()
    })
  })
}

module.exports = {
  insertUtilizador,
  loginUser
}