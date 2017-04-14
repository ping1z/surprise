var BaseDao = require("./baseDao.js");
var LineItemDao = require("./lineItemDao.js");
var lineItem = new LineItemDao();
var uuid = require('node-uuid');

var ReturnDao = function(){
    this.table = 'Return';
}
ReturnDao.prototype = Object.create(BaseDao.prototype);

ReturnDao.prototype.findByFilter = function(columns, filters, orderBy, page, count, callback){
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

ReturnDao.prototype.initReturnItems = function(lineItems, callback){
    var pool = this.pool;
    var _ = this;
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            var trackingNumber = uuid.v1();
            var queries = "";
            
            for(var i=0;i<lineItems.length;i++){
                var sql="INSERT INTO surprise.Return (customerId, status, orderId,productSKU,lineItemId,returnQuantity,refundAmount,refundCardId, response, trackingNumber, returnMethod, createdTime,lastModifiedTime)"
                    +" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());";
                var i = lineItems[i];
                var values=[i.customerId,0,i.orderId, i.productSKU, i.id, i.returnQuantity, i.refundAmount, i.cardId, i.response, trackingNumber, 0];
                sql = BaseDao.formatSQL(sql, values);
                var d="UPDATE surprise.LineItem SET status=4, lastModifiedTime=NOW()"
                    +" WHERE id=?;"
                values=[i.id]
                sql += BaseDao.formatSQL(d, values);       
                queries+=sql
            }
            console.log(queries);
            connection.query(queries,function(error, result, fields){
                if (error) {
                    return connection.rollback(function() {
                        callback && callback(error);
                        throw error;
                    });
                }
                connection.commit(function(err) {
                    if (err) {
                        return connection.rollback(function() {
                            callback && callback(err);
                            throw err;
                        });
                    }
                    connection.release();
                    callback && callback();
                });
            });
        })
    })
};

ReturnDao.prototype.findOneWithJoinInfo = function(id,callback){

    var sql="SELECT r.*, p.name, p.description, p.contents, p.picture"
        +" FROM surprise.Return r "
        +"     JOIN surprise.Product p "
        +"     ON p.sku = r.productSKU "
        +" WHERE r.id=? Limit 1";

    var values=[id];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("findOneWithJoinInfo",error,res);
        var item = null;
        if(res.length > 0)item = res[0];
        
        callback && callback(error, item);

    });
};


ReturnDao.prototype.setlineItemStatus = function(connection, lineItemId,status, callback){
    var sql="UPDATE surprise.LineItem SET status=?, lastModifiedTime=NOW()"
        +" WHERE id=?"
    var values=[status, lineItemId];
    
    connection.query(sql,values, function(error, result, fields){
        if (error) {
            return connection.rollback(function() {
                throw error;
            });
        }
        callback && callback(result);
    });
} 

ReturnDao.prototype.confirmReceived = function(returnItem, callback){
    var pool = this.pool;
    var _ = this;
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            _.setlineItemStatus(connection,returnItem.lineItemId,5,function(r){
                var sql="UPDATE surprise.Return SET status=?, receivedTime=NOW(), lastModifiedTime=NOW()"
                    +" WHERE id=?"
                var values=[1, returnItem.id];
                console.log(BaseDao.formatSQL(sql, values));
                connection.query(sql,values, function(error, result, fields){
                    if (error) {
                        return connection.rollback(function() {
                            callback && callback(error);
                            throw error;
                        });
                    }
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                callback && callback(err);
                                throw err;
                            });
                        }
                        connection.release();
                        callback && callback();
                    });
                });
            })
        })
    })
};

ReturnDao.prototype.confirmRefund = function(returnItem, callback){
    var pool = this.pool;
    var _ = this;
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            _.setlineItemStatus(connection,returnItem.lineItemId,6,function(r){
                var sql="UPDATE surprise.Return SET status=?, receivedTime=NOW(), lastModifiedTime=NOW()"
                    +" WHERE id=?"
                var values=[2, returnItem.id];
                console.log(BaseDao.formatSQL(sql, values));
                connection.query(sql,values, function(error, result, fields){
                    if (error) {
                        return connection.rollback(function() {
                            callback && callback(error);
                            throw error;
                        });
                    }
                    var priceBeforeTax=returnItem.refundAmount/1.08;
                    var tax = returnItem.refundAmount-priceBeforeTax;
                    sql="UPDATE surprise.Order SET totalBeforeTax=totalBeforeTax-?, tax=tax-?, lastModifiedTime=NOW()"
                        +" WHERE id=?"
                    values=[1, returnItem.orderId,priceBeforeTax,tax];
                    console.log(BaseDao.formatSQL(sql, values));
                    connection.query(sql,values, function(error, result, fields){
                        if (error) {
                            return connection.rollback(function() {
                                callback && callback(error);
                                throw error;
                            });
                        }
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    callback && callback(err);
                                    throw err;
                                });
                            }
                            connection.release();
                            callback && callback();
                        });
                    });
                });
            })
        })
    })
};

exports = module.exports = ReturnDao;