 var BaseDao = require("./baseDao.js");

var ProductDao = function(){
    this.table = 'Product';
}

ProductDao.prototype = Object.create(BaseDao.prototype);
ProductDao.prototype.findByProductSKU = function(productSKU,callback){
    this.findOne(null, "`productSKU`=\""+productSKU+"\"",function(error, user){
        callback && callback(error, user);
    });
};

ProductDao.prototype.addToCart = function(productSKU,callback){
    this.findOne(null, "`productSKU`=\""+productSKU+"\"",function(error, user){
        callback && callback(error, user);
    });
};