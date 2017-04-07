var BaseDao = require("./baseDao.js");

var SubscriptionDao = function(){
    this.table = 'Subscription';
}
SubscriptionDao.prototype = Object.create(BaseDao.prototype);

SubscriptionDao.prototype.saveSubscription = function(customerId, address, card, item, callback){
    var sql="INSERT INTO surprise.Subscription (customerId, status, productSKU, price, quantity, frequency, addressId, cardId, nextOrderTime, createdTime,lastModifiedTime)"
        +" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW());";
    var i = item;
    var values=[customerId,1,i.sku, i.price, i.quantity, i.frequency, address.id, card.id];
    sql = BaseDao.formatSQL(sql, values);
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("saveSubscription",error,res);
       
        callback && callback(error, res);

    });
};

SubscriptionDao.prototype.updateSubscription = function(customerId, address, card, item, callback){
    var sql="UPDATE surprise.Subscription SET quantity=?, frequency=?, addressId=?, cardId=?, lastModifiedTime=NOW()"
        +" WHERE id=? AND customerId=?"
    var i = item;
    var values=[i.quantity, i.frequency, address.id, card.id, i.id, customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("updateSubscription",error,res);
        callback && callback(error, res);
    });
};

SubscriptionDao.prototype.findByCustomerId = function(customerId,callback){

    var sql="SELECT s.*, p.name, p.description, p.contents, p.picture"
        +" FROM surprise.Subscription s "
        +"     JOIN surprise.product p "
        +"     ON p.sku = s.productSKU "
        +" WHERE s.customerId=?";

    var values=[customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("findByCustomerId",error,res);
        callback && callback(error, res);
    });
};



SubscriptionDao.prototype.switchStatus = function(id,customerId, fromS, toS, callback){
   var sql="UPDATE surprise.Subscription SET status=?, lastModifiedTime=NOW()"
        +" WHERE id=? AND customerId=? AND status=?"
    var values=[toS, id, customerId, fromS];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("switchStatus",error,res);
        callback && callback(error, res);
    });
};

SubscriptionDao.prototype.deleteSubscription = function(id,customerId,callback){
   var sql="DELETE FROM surprise.Subscription WHERE id=? AND customerId=?";
    var values=[id,customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("deleteSubscription",error,res);
        callback && callback(error, res);
    });
};


SubscriptionDao.prototype.findOneAvaliable = function(callback){

    var sql="SELECT s.* , p.name, p.description, p.contents, p.picture FROM surprise.Subscription s "
        +"     JOIN surprise.product p "
        +"     ON p.sku = s.productSKU "
        +" WHERE s.status=1 AND s.nextOrderTime<=NOW() LIMIT 1;";
    var _=this;
    _.execute(sql,[], function(error, results){
         var item = null;
        if(results.length > 0)item = results[0];
        callback && callback(error, results[0]);
    });
};


SubscriptionDao.prototype.updateNextOrderTimeStatus = function(id, frequency, callback){
    var t = frequency.split("");
    
    switch(t[1]){
        case "d": t[1]=" DAY ";break;
        case "m": t[1]=" MONTH ";break;
        case "y": t[1]=" YEAD ";break;
    }
    var shiftTime = "INTERVAL "+t[0]+t[1];
    var sql="UPDATE surprise.Subscription SET nextOrderTime=nextOrderTime+INTERVAL "+ +t[0]+t[1]+", lastModifiedTime=NOW()"
        +" WHERE id=?"
    var values=[id];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("updateNextOrderTimeStatus",error,res);
        callback && callback(error, res);
    });
};

exports = module.exports = SubscriptionDao;