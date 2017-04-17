var MongoBaseDao = require("./mongoBaseDao.js");

var ReviewDao = function(){
    this.collection = null; 
}

ReviewDao.prototype.getCollection = function(callback){
    var _ = this;
    MongoBaseDao.getConnection(function(db){
      _.collection = db.collection('review')

      callback && callback(_.collection );
    }) 
}
ReviewDao.prototype.saveReview = function(sku,customerId,customerName,rate,comment,callback){
  this.getCollection(function(collection){

    var doc = {
      'sku':sku,
      'customerId':customerId,
      'customerName':customerName,
      'rate':rate,
      'comment':comment,
      'createdTime':new Date(),
    };

    collection.insert(doc,{w:1},function(error,result){
      callback && callback(error,result);
    });

  });

}

ReviewDao.prototype.listReview = function(sku,limit,callback){
  this.getCollection(function(collection){
    collection.find({'sku':sku}).sort({'createdTime': -1}).limit(limit).toArray(function(error, result) {
        callback && callback(error,result);
    });
  });

}

exports = module.exports = ReviewDao;