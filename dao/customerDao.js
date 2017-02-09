var BaseDao = require("./baseDao.js");

var CustomerDao = function(){
    this.table = 'Customer';
}
CustomerDao.prototype = Object.create(BaseDao.prototype);
CustomerDao.prototype.findOneWithPassword = function(userIdentity,callback){
    var sql = "SELECT id, username, email, telephone, password"
                +" FROM Customer join User ON Customer.id = User.customerId"
                +" WHERE username=? OR email=? OR telephone=? LIMIT 1";
    var values = [userIdentity,userIdentity,userIdentity];
    this.execute(sql, values, function(error, res){
        var item = null;
        if(res.length > 0)item = res[0];
        callback && callback(error, item);
    });
};

CustomerDao.prototype.findOneById = function(id, callback){
    this.findOne(null, "`id`=\""+id+"\"",function(error, user){
        callback && callback(error, user);
    });
};

CustomerDao.prototype.update = function(id, data, callback){
    var sql = "UPDATE Customer "
            +"SET ? "
            +"WHERE id = ?;";
    var values = [data, id];
    this.execute(sql, values, function(error, res){
        callback && callback(error, res);
    });
}

CustomerDao.prototype.delete = function(id, callback){

    //var sql = "DELETE FROM Customer "
     //   +"WHERE id = ?;";
    var sql = "DELETE customer,user FROM customer LEFT JOIN user ON customer.id=user.customerId WHERE user.customerId=?;"
    var values = id;

    this.execute(sql, values, function(error, res){
        callback && callback(error, res);
    });
}

exports = module.exports = CustomerDao;