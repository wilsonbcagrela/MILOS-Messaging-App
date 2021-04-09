const mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var db;

module.exports = {
    connect: function (callback) {
        MongoClient.connect('mongodb+srv://G8:8xKieDpip2IgbQad@clusterdbw.1dbjr.mongodb.net/G8?authSource=admin&replicaSet=atlas-bek8xj-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', { useNewUrlParser: true, useUnifiedTopology: true },function (err, database) {
            console.log('Connected the database on port 27017');
            //Insert DB name as the group id - G[id]
            db = database.db('G8');
            callback(err);
        })},
    getDB:function(){
        return db;
    }

}
