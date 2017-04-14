var BaseDao = require("./baseDao.js");
var LineItemDao = require("./lineItemDao.js");
var lineItem = new LineItemDao();

var ShipmentDao = function(){
    this.table = 'Shipment';
}
ShipmentDao.prototype = Object.create(BaseDao.prototype);

ShipmentDao.prototype.findByFilter = function(columns, filters, orderBy, page, count, callback){
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

ShipmentDao.prototype.findOneById = function(id, callback){
    //columns, query, orderBy, limit, offset, callback
    this.findOne(null, "`id`=\""+id+"\"",function(error, addr){
        console.log(error);
        callback && callback(error, addr);
    });
};

ShipmentDao.prototype.findOneWithLineItems = function(id, callback){
    this.findOneById(id,function(e,s){
        if(e){
            var error={msg:e.message,stack:e.stack};
             callback && callback(error, null);
        }
        lineItem.findByShipmentId(id,function(e, i){
            if(e){
                var error={msg:e.message,stack:e.stack};
            }
            var data = {
            shipment:s,
            lineItems:i
            };
            callback && callback(error, data);
        
        })
    });
};
ShipmentDao.prototype.setlineItemStatus = function(connection, shipmentId,status, callback){
    var sql="UPDATE LineItem SET status=?, lastModifiedTime=NOW()"
        +" WHERE shipmentId=?"
    var values=[status, shipmentId];
    
    connection.query(sql,values, function(error, result, fields){
        if (error) {
            return connection.rollback(function() {
                throw error;
            });
        }
        callback && callback(result);
    });
} 
ShipmentDao.prototype.confirmPacked = function(id, callback){
    var pool = this.pool;
    var _ = this;
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            _.setlineItemStatus(connection,id,1,function(r){
                var sql="UPDATE Shipment SET status=?, packedTime=NOW(), lastModifiedTime=NOW()"
                    +" WHERE id=?"
                var values=[1, id];
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

ShipmentDao.prototype.confirmShipped = function(id, callback){
    var pool = this.pool;
    var _ = this;
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            _.setlineItemStatus(connection,id,2,function(r){
                var sql="UPDATE Shipment SET status=?, shippedTime=NOW(), estimatedTime=NOW()+INTERVAL 2 DAY, lastModifiedTime=NOW()"
                    +" WHERE id=?"
                var values=[2, id];
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

ShipmentDao.prototype.confirmDelivered = function(id, callback){
    var pool = this.pool;
    var _ = this;
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            _.setlineItemStatus(connection,id,3,function(r){
                var sql="UPDATE Shipment SET status=?, deliveredTime=NOW(), lastModifiedTime=NOW()"
                    +" WHERE id=?"
                var values=[3, id];
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

exports = module.exports = ShipmentDao;