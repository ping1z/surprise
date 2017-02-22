var BaseDao = require("./baseDao.js");

var productDao = function(){
    this.table = 'Product';
}

productDao.prototype = Object.create(BaseDao.prototype);

productDao.prototype.findone = function(text , callback){
    this.findLikeOne(null,"`name` LIKE \"%"+text+"%\"", function(err, results){

        callback && callback(err, results);
    });
};

exports = module.exports = productDao;