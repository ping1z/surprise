var BaseDao = require("./baseDao.js");

var AddressDao = function(){
    this.table = 'Address';
}
AddressDao.prototype = Object.create(BaseDao.prototype);
AddressDao.prototype.findById = function(id,customerId, callback){
    //columns, query, orderBy, limit, offset, callback
    this.findOne(null, "`id`=\""+id+"\" AND `customerId`=\""+customerId+"\"",function(error, addr){
        console.log(error);
        callback && callback(error, addr);
    });
};
AddressDao.prototype.findByCustomerId = function(id,callback){
    //columns, query, orderBy, limit, offset, callback
    this.find(null, "`customerId`=\""+id+"\"","`isDefault` desc", null, null,function(error, addr){
        console.log(error);
        callback && callback(error, addr);
    });
};
AddressDao.prototype.addAddress = function(customerId,name,line1,line2,city,state,country,zipcode,telephone,callback){
    var sql="INSERT INTO surprise.Address (customerId,name,line1,line2,city,state,country,zipcode,telephone,isDefault)"
          +" VALUES ( ?, ?, ?, ?, ?, ?, ?,?,?,0)";
    var values=[customerId,name,line1,line2,city,state,country,zipcode,telephone,];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("addAddresse",error,res);
        callback && callback(error, res);
    });
};

AddressDao.prototype.updateAddress = function(id,name,line1,line2,city,state,country,zipcode,telephone,callback){
   var sql="UPDATE Address SET name=?, line1=?, line2=?, city=?, state=?, country=?, zipcode=?, telephone=?"
          +" WHERE id=?";
    var values=[name,line1,line2,city,state,country,zipcode,telephone,id];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("updateAddress",error,res);
        callback && callback(error, res);
    });
};
AddressDao.prototype.deleteAddress = function(id,customerId,callback){
   var sql="DELETE FROM Address WHERE id=? AND customerId=? AND isDefault=0";
    var values=[id,customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("deleteAddress",error,res);
        callback && callback(error, res);
    });
};
AddressDao.prototype.setAsDefault = function(id,customerId,callback){
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
exports = module.exports = AddressDao;