var BaseDao = require("./baseDao.js");

var CatalogDao = function(){
    this.table = 'Catalog';
}

CatalogDao.prototype = Object.create(BaseDao.prototype);

CatalogDao.prototype.findAll = function(columns, orderBy, callback){
    this.find(columns, null, orderBy, null, null, function(error, results){
        callback && callback(error, results);
    });
};

CatalogDao.prototype.findone = function(text , callback){
    this.findLikeOne(null,"`name` LIKE \"%"+text+"%\"", function(err, results){

        callback && callback(err, results);
    });
};

exports = module.exports = CatalogDao;