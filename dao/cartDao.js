var BaseDao = require("./baseDao.js");

var CartDao = function(){
    this.table = 'Cart';
}

CartDao.prototype = Object.create(BaseDao.prototype);
CartDao.prototype.getCartItemCount = function(customerId,callback){
    var sql="SELECT Count(id) FROM surprise.Cart WHERE customerId=?";
    var values=[customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("getCartItemCount",error,res);
        callback && callback(error, res[0]["Count(id)"]);
    });
}
CartDao.prototype.addToCart = function(customerId,productSKU,callback){
    var pool = this.pool;
    var _ = this;
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            var sql="UPDATE surprise.Cart SET quantity=quantity+1,lastModifiedTime=NOW()"
            +" WHERE customerId=? AND productSKU=?"
            var values=[customerId,productSKU];
            connection.query(sql,values,function(error, result, fields){
                if (error) {
                    return connection.rollback(function() {
                        throw error;
                    });
                }
                if(result.affectedRows==1){
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                throw err;
                            });
                        }
                        connection.release();
                        callback && callback(err);
                    });
                }else{
                    var sql="INSERT INTO surprise.Cart (customerId,productSKU,quantity,createdTime,lastModifiedTime)"
                        +" VALUES ( ?, ?, ?, NOW(),NOW())";
                    var values=[customerId,productSKU, 1];
                    connection.query(sql,values,function(e, r, f){
                        if (e) {
                            return connection.rollback(function() {
                                throw e;
                            });
                        }
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    throw err;
                                });
                            }
                            connection.release();
                            callback && callback(err);
                        });
                    });
                }
            });
        });
    });
}

CartDao.prototype.findByCustomerId = function(customerId,callback){
    //columns, query, orderBy, limit, offset, callback
    var sql ="SELECT * FROM "+
    "(SELECT * FROM surprise.Cart WHERE `customerId`=?) c "
    +"INNER JOIN (SELECT sku, name, description, occasion, department, gender, age, price, contents, quantity as productQuantity, picture FROM surprise.Product) p "
    +"ON c.productSKU = p.sku";

    var values=[customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("findByCustomerId",error,res);
        callback && callback(error, res);
    });
};

CartDao.prototype.deleteCart = function(id,customerId,callback){
   var sql="DELETE FROM Cart WHERE id=? AND customerId=?";
    var values=[id,customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("deleteCart",error,res);
        callback && callback(error, res);
    });
};

CartDao.prototype.updateQuantity = function(id,customerId, quantity, callback){
    var sql="UPDATE Cart SET quantity=?"
          +" WHERE id=? AND customerId=?";
    var values=[quantity, id, customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
         console.log("deleteCart",error,res);
         callback && callback(error, res);
    });
};

exports = module.exports = CartDao;