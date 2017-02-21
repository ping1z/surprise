var BaseDao = require("./baseDao.js");

var AdminDao = function(){
    this.table = 'Admin';
}

AdminDao.prototype = Object.create(BaseDao.prototype);

AdminDao.prototype.findOneById = function(id,callback){
    this.findOne(null, "`id`=\""+id+"\"",function(error, user){
        callback && callback(error, user);
    });
};

AdminDao.prototype.findOneByEmail = function(email,callback){
    this.findOne(null, "`email`=\""+email+"\"",function(error, user){
        callback && callback(error, user);
    });
};
exports = module.exports = AdminDao;