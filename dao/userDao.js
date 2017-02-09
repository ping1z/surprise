var BaseDao = require("./baseDao.js");

var UserDao = function(){
    this.table = 'User';
}

UserDao.prototype = Object.create(BaseDao.prototype);
UserDao.prototype.findByCustomerId = function(customerId,callback){
    this.findOne(null, "`customerId`=\""+customerId+"\"",function(error, user){
        callback && callback(error, user);
    });
};
exports = module.exports = UserDao;