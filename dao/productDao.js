
var BaseDao = require("./baseDao.js");

var ProductDao = function(){
    this.table = 'Product';
}

ProductDao.prototype = Object.create(BaseDao.prototype);

ProductDao.prototype.findAll = function(columns, orderBy, callback){
    this.find(columns, null, orderBy, null, null, function(error, results){
        console.log(results);
        callback && callback(error, results);
    });
};

ProductDao.prototype.findone = function(gender , occasions , text , callback){

    if(gender!="Gender"&&occasions!="Occasions")
    { this.findLikeOne(null,"`gender` = \""+gender+"\" and `occasions` = \""+occasions+"\" ", function(err, results){
        callback && callback(err, results);
    });
    } else if(gender!="Gender"&&occasions=="Occasions"){
        this.findLikeOne(null,"`gender` = \""+gender+"\"", function(err, results){
            callback && callback(err, results);
        });
    } else if(gender=="Gender"&&occasions!="Occasions"){
        this.findLikeOne(null,"`occasions` = \""+occasions+"\"", function(err, results){
            callback && callback(err, results);
        });
    }
    if (text!=0){
        this.findLikeOne(null,"`name` LIKE \"%"+text+"%\"", function(err, results){
            callback && callback(err, results);
        });
    }

};
exports = module.exports = ProductDao;