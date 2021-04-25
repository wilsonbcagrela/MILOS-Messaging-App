var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var url = "mongodb+srv://G8:8xKieDpip2IgbQad@clusterdbw.1dbjr.mongodb.net/G8?authSource=admin&replicaSet=atlas-bek8xj-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

var dbo
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
   dbo = db.db("G8");
})


// mongoose.connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// const utilizadorSchema = new mongoose.Schema({
//   name:{
//     type: String,
//     required: true
//   },
//   password:{
//     type: String,
//     required: true
//   },
//   image:{
//     type: String,
//     required: true
//   }
// });



async function insertUtilizador(nome,password,img,res){
  let _find = await dbo.collection("Utilizadores").findOne({name : nome})
  console.log(_find)
  if(_find == null) {
    dbo.collection("Utilizadores").insertOne({name:nome,password:password,image:img}, function(err, res) {
      if (err) throw err;
      console.log("Foi registado com sucesso :-D");
    })
    return res.redirect('/');
  } else{
    var erro = 1;
    return res.render('registo.ejs', { erro : erro });
  }

}

function loginUser(nome, password, callback){
  MongoClient.connect(url,  async function(err, db) {
    if (err) throw err;
    var dbo = db.db("G8");
      dbo.collection("Utilizadores").findOne({name : nome}, function(err, result) {
        if (err){
          console.log(err);
          return
        }
        console.log(result);

        callback(result);
        db.close();
      });
  });
}

function criarCHAT(userID,nameCHAT,conversas,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("G8");
    dbo.collection("Utilizadores").insertOne({name:nome,password:password,image:img}, function(err, res) {
      if (err) throw err;
      console.log("Foi registado com sucesso :-D");
      db.close();
    });
  });
}


// const utilizador = mongoose.model('Utilizadores', utilizadorSchema);

module.exports = {
  insertUtilizador,
  loginUser
  // utilizador

};