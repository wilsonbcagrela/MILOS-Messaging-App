var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
var url = "mongodb+srv://G8:8xKieDpip2IgbQad@clusterdbw.1dbjr.mongodb.net/G8?authSource=admin&replicaSet=atlas-bek8xj-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const utilizadorSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  image:{
    type: String,
    required: true
  }
});


function insertUtilizador(nome,password,img,callback){
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
// function loginUser(nome, password){
//   MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("G8");

//     dbo.collection("Utilizadores").findOne({}, function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       db.close();
//     });
//   });
// }
const utilizador = mongoose.model('utilizador', utilizadorSchema);

module.exports = {
  insertUtilizador,
  utilizador
  // loginUser
  
};