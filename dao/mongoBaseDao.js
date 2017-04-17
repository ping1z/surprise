var MongoClient = require('mongodb').MongoClient;

var MongoBaseDao = function(){
    this.db = null;
    console.log('MongoBaseDao');
}

MongoBaseDao.prototype.getConnection = function(callback){
    var _ = this;
    if(_.db == null){
        MongoClient.connect("mongodb://localhost:27017/surprise", {  
            poolSize: 10
        },function(err, db) {
            if(!err) {
            console.log("Mongodb connected.");
            }
            
            _.db = db;
            callback && callback(_.db);
        });
    }else{
        callback && callback(_.db);
    }
}

exports = module.exports = new MongoBaseDao();

