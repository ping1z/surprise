var BaseDao = require("./baseDao.js");

var CardDao = function(){
    this.table = 'Card';
}

CardDao.prototype = Object.create(BaseDao.prototype);
CardDao.prototype.get = function(id, callback){
    //columns, query, orderBy, limit, offset, callback
    this.findOne(null, "`id`="+id,function(error, addr){
        console.log(error);
        callback && callback(error, addr);
    });
};
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

CardDao.prototype.addCard = function(customerId,type, name,cardNumber,line1,line2,city,state,zipcode,expirationDate,cvv,callback){
    var sql="INSERT INTO Card (customerId,type,name,cardNumber,line1,line2,city,state,zipcode,expirationDate,cvv,isDefault)"
          +" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,0)";
    var values=[customerId,type, name,cardNumber,line1,line2,city,state,zipcode,expirationDate,cvv];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("addCard",error,res);
        callback && callback(error, res);
    });
};

CardDao.prototype.updateCard = function(id,type, name,cardNumber,line1,line2,city,state,zipcode,expirationDate,cvv,callback){
   var sql="UPDATE Card SET type=?, name=?, cardNumber=?, line1=?, line2=?, city=?, state=?,=?, zipcode=?, expirationDate=?, cvv=?"
          +" WHERE id=?";
    var values=[type, name,cardNumber,line1,line2,city,state,zipcode,expirationDate,cvv,id];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("updateCard",error,res);
        callback && callback(error, res);
    });
};

CardDao.prototype.deleteCard = function(id,customerId,callback){
   var sql="DELETE FROM Card WHERE id=? AND customerId=? AND isDefault=0";
    var values=[id,customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("deleteCard",error,res);
        callback && callback(error, res);
    });
};
CardDao.prototype.setAsDefault = function(id,customerId,callback){
    var sql="UPDATE Card SET isDefault=0"
          +" WHERE customerId=? AND isDefault=1";
    var values=[customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        sql="UPDATE Card SET isDefault=1"
          +" WHERE id=? AND customerId=? AND isDefault=0" ;
        values=[id, customerId];
         _.execute(sql,values,function(e, r){
            callback && callback(e, r);
        });
    });
};

CardDao.prototype.listCard = function(id){
   var sql="SELECT * FROM Card"
          +" WHERE id=?";
    var values=[id];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("listCard",error,res);
        callback && callback(error, res);
    });
};

exports = module.exports = CardDao;