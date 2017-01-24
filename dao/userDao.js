var BaseDao = require("./baseDao.js");

var UserDao = function(){
    this.table = 'user';
}
UserDao.prototype = Object.create(BaseDao.prototype);
UserDao.prototype.findByUserId = function(userId,callback){
    this.findOne(null, "`userId`=\""+userId+"\"",function(error, user){
        callback && callback(error, user);
    });
};

exports = module.exports = UserDao;