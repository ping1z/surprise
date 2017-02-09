var BaseDao = require("./baseDao.js");

var CustomerDao = function(){
    this.table = 'Customer';
}

CustomerDao.prototype = Object.create(BaseDao.prototype);
CustomerDao.prototype.findOneWithPassword = function(userIdentity,callback){
    var sql = "SELECT id, email, password"
                +" FROM Customer join User ON Customer.id = User.customerId"
                +" WHERE email=? LIMIT 1";
    var values = [userIdentity];
    this.execute(sql, values, function(error, res){
        var item = null;
        if(res.length > 0)item = res[0];
        callback && callback(error, item);
    });
};

// get current time method: GETDATE().
// callback refers to the function in router.js, 
// when the result is generated, it will callback the function in router.js.
CustomerDao.prototype.signUp = function(email, firstName, lastName, password, callback){
//    "?" represent values to be input.
// execute(sql,values) let the values insert into the correspongding place. This is a function defined in baseDao.js.
    var sql="INSERT INTO surprise.Customer (email, firstName, lastName, createdTime)"
          +" VALUES ( ?, ?, ?, NOW())"
    var values=[email,firstName,lastName];
    var _ = this;
    _.execute(sql,values,function(error, res){
        console.log(1,error,res,res.affectedRows!=1);
        if(error||res.affectedRows!=1){
            callback && callback(error, res);
        }
        var newCustomId = res.insertId;
        
        sql="INSERT INTO surprise.User (customerId, password)"
          +" VALUES ( ?, ?)"
        values=[newCustomId,password];
        _.execute(sql,values,function(e, r){
            console.log(2,e, r);
            callback && callback(e, r);
        });
    });
}

CustomerDao.prototype.update = function(id, firstName, middleName, lastName, callback){
    var sql="UPDATE Customer SET firstName=?, middleName=?, lastName=?, lastModifiedTime=NOW()"
          +" WHERE id=?"
    var values=[firstName, middleName, lastName,  parseInt(id)];
    var _ = this;
    _.execute(sql,values,function(error, res){
        console.log(1,error,res,res.affectedRows!=1);
        callback && callback(error, res);
    });
}

CustomerDao.prototype.findOneById = function(id,callback){
    this.findOne(null, "`id`=\""+id+"\"",function(error, user){
        callback && callback(error, user);
    });
};

exports = module.exports = CustomerDao;