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
    var sql="UPDATE Subscription SET quantity=?, frequency=?, addressId=?, cardId=?, lastModifiedTime=NOW()"
        +" WHERE id=? AND customerId=?"
    var i = item;
    var values=[i.quantity, i.frequency, address.id, card.id, item.id, customerId];
    sql = BaseDao.formatSQL(sql, values);
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("updateSubscription",error,res);
       
        callback && callback(error, res);

    });
};

SubscriptionDao.prototype.findByCustomerId = function(customerId,callback){

    var sql="SELECT s.*, p.name, p.description, p.contents, p.picture"
        +" FROM Subscription s "
        +"     JOIN Product p "
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
   var sql="DELETE FROM Subscription WHERE id=? AND customerId=?";
    var values=[id,customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("deleteSubscription",error,res);
        callback && callback(error, res);
    });
};


SubscriptionDao.prototype.findOneById = function(id, callback){
    var sql="SELECT s.* , p.name, p.description, p.contents, p.picture, p.quantity AS productQuantity FROM surprise.Subscription s "
        +"     JOIN Product p "
        +"     ON p.sku = s.productSKU "
        +" WHERE s.id=? LIMIT 1;";
    var values=[id];
    var _=this;
    _.execute(sql,values, function(error, results){
         var item = null;
        if(results.length > 0)item = results[0];
        callback && callback(error, results[0]);
    });
};

SubscriptionDao.prototype.findOneAvaliable = function(callback){

    var sql="SELECT s.* , p.name, p.description, p.contents, p.picture FROM surprise.Subscription s "
        +"     JOIN Product p "
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
    
    var sql="UPDATE Subscription SET nextOrderTime=nextOrderTime+INTERVAL "+ frequency +" MONTH, lastModifiedTime=NOW(), lastOrderTime=NOW()"
        +" WHERE id=?"
    var values=[id];
    var _=this;
    console.log(BaseDao.formatSQL(sql, values));
    _.execute(sql,values,function(error, res){
        console.log("updateNextOrderTimeStatus",error,res);
        callback && callback(error, res);
    });
};

SubscriptionDao.prototype.findByFilter = function(columns, filters, orderBy, page, count, callback){
    var query = '';
    for(var i=0;i<filters.length;i++){
        if(query)query+=" AND ";

        query+="`"+filters[i].key+"`=";
        if(typeof filters[i].value == 'string'){
            query+="\""+filters[i].value+"\"";
        }else{
            query+=filters[i].value;
        }
    }
    this.findByPage(columns, query, orderBy, page, count,function(error, results){
        console.log(error);

        callback && callback(error, results);
    });
}

exports = module.exports = SubscriptionDao;