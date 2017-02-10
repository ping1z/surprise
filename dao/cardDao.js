var BaseDao = require("./baseDao.js");

var CardDao = function(){
    this.table = 'Card';
}

CardDao.prototype = Object.create(BaseDao.prototype);
CardDao.prototype.findById = function(id,customerId, callback){
    //columns, query, orderBy, limit, offset, callback
    this.findOne(null, "`id`=\""+id+"\" AND `customerId`=\""+customerId+"\"",function(error, addr){
        console.log(error);
        callback && callback(error, addr);
    });
};
CardDao.prototype.findByCustomerId = function(id,callback){
    //columns, query, orderBy, limit, offset, callback
    this.find(null, "`customerId`=\""+id+"\"","`isDefault` desc", null, null,function(error, addr){
        console.log(error);
        callback && callback(error, addr);
    });
};
CardDao.prototype.addCard = function(customerId,name,cardNumber,line1,line2,city,state,country,zipcode,expirationDate,cvv,callback){
    var sql="INSERT INTO surprise.Address (customerId,name,cardNumber,line1,line2,city,state,country,zipcode,expirationDate,cvv,isDefault)"
          +" VALUES ( ?, ?, ?, ?, ?, ?, ?,?,?,?,?,0)";
    var values=[customerId,name,cardNumber,line1,line2,city,state,country,zipcode,expirationDate,cvv];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("addAddresse",error,res);
        callback && callback(error, res);
    });
};

CardDao.prototype.updateAddress = function(id,name,cardNumber,line1,line2,city,state,country,zipcode,expirationDate,cvv,callback){
   var sql="UPDATE Address SET name=?, cardNumber=?, line1=?, line2=?, city=?, state=?, country=?, zipcode=?, expirationDate=?, cvv=?"
          +" WHERE id=?";
    var values=[name,cardNumber,line1,line2,city,state,country,zipcode,expirationDate,cvv,id];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("updateAddress",error,res);
        callback && callback(error, res);
    });
};
CardDao.prototype.deleteAddress = function(id,customerId,callback){
   var sql="DELETE FROM Address WHERE id=? AND customerId=? AND isDefault=0";
    var values=[id,customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("deleteAddress",error,res);
        callback && callback(error, res);
    });
};
CardDao.prototype.setAsDefault = function(id,customerId,callback){
    var sql="UPDATE Address SET isDefault=0"
          +" WHERE customerId=? AND isDefault=1";
    var values=[customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        sql="UPDATE Address SET isDefault=1"
          +" WHERE id=? AND customerId=? AND isDefault=0" ;
        values=[id, customerId];
         _.execute(sql,values,function(e, r){
            callback && callback(e, r);
        });
    });
};
exports = module.exports = CardDao;