var BaseDao = require("./baseDao.js");

var UserDao = function(){
    this.table = 'User';
}

UserDao.prototype = Object.create(BaseDao.prototype);
UserDao.prototype.findByCustomerId = function(customerId,callback){
    this.findOne(null, "`customerId`=\""+customerId+"\"",function(error, user){
        callback && callback(error, user);
        console.log(user);
    });
};

UserDao.prototype.createUser = function(customerId, password, callback) {
    var sql="INSERT INTO surprise.User (customerId, password)"
          +" VALUES (?, ?);"
    var values=[customerId, password];
    this.execute(sql,values,function(error, res){
         callback && callback(error, res);
    });
}
exports = module.exports = UserDao;