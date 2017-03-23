var BaseDao = require("./baseDao.js");
var LineItemDao = require("./lineItemDao.js");
var lineItem = new LineItemDao();
var uuid = require('node-uuid');

var ReturnDao = function(){
    this.table = 'Return';
}
ReturnDao.prototype = Object.create(BaseDao.prototype);

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

exports = module.exports = ReturnDao;