var uuid = require('node-uuid');
var BaseDao = require("./baseDao.js");

var OrderDao = function(){
    this.table = 'Order';
}

OrderDao.prototype = Object.create(BaseDao.prototype);


OrderDao.prototype.findByCustomerId = function(id,callback){
    var sql="SELECT * FROM surprise.Order WHERE `customerId`=?  ORDER BY `createdTime` desc ;" 
    var values =[id];
    //columns, query, orderBy, limit, offset, callback
     var _=this;
    _.execute(sql,values,function(error, res){
        
        callback && callback(error, res);
    });
};

OrderDao.prototype.saveGuestAddress = function(connection, address, callback){
    var sql="INSERT INTO surprise.Address (customerId,name,line1,line2,city,state,country,zipcode,telephone,isDefault)"
        +" VALUES ( ?, ?, ?, ?, ?, ?, ?,?,?,0)";
    var a = address;
    var values=[0,a.name,a.line1,a.line2,a.city,a.state,a.country,a.zipcode,a.telephone];
    connection.query(sql,values,function(error, result, fields){
        if (error) {
            return connection.rollback(function() {
                throw error;
            });
        }
        address.id = result.insertId;

        callback && callback(address);
    });
}
OrderDao.prototype.saveGuestCard = function(connection, card, callback){
    var sql="INSERT INTO surprise.Card (customerId,type,name,cardNumber,line1,line2,city,state,zipcode,expirationDate,cvv,isDefault)"
        +" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,0)";
    var c = card;
    var values=[0,c.type,c.name,c.cardNumber,c.line1,c.line2,c.city,c.state,c.zipcode,c.expirationDate,c.cvv];
    connection.query(sql,values,function(error, result, fields){
        if (error) {
            return connection.rollback(function() {
                throw error;
            });
        }
        card.id = result.insertId;
        callback && callback(card);
    });
}
OrderDao.prototype.saveOrderInfo = function(connection, customerId, order,address,card, cartItems, callback){
    var trackingNumber = uuid.v1();
    var sql="INSERT INTO surprise.Order (customerId,status,addressId,cardId,totalBeforeTax,tax,shippingCost,lineItemCount,trackingNumber, createdTime,lastModifiedTime)"
            +" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?,NOW(),NOW())";
    var o = order;
    var values=[customerId, 0, address.id, card.id, o.totalBeforeTax,o.tax,o.shippingCost,cartItems.length,trackingNumber];
    console.log(BaseDao.formatSQL(sql, values));
    connection.query(sql,values,function(error, result, fields){
        if (error) {
            return connection.rollback(function() {
                throw error;
            });
        }
        order.id = result.insertId;
        callback && callback(order);
    });
}

OrderDao.prototype.saveOrderPayment = function(connection, customerId, order,card, callback){
    var sql="INSERT INTO surprise.OrderPayment (customerId,status,orderId,amount,currencyType,cardId,cardType,cardNumber,cardOwnerName,cardExpirationDate, cardCVV,billingLine1,billingLine2,billingCity,billingState,billingCountry, billingZipcode,createdTime)"
            +" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,NOW())";
    var o = order;
    var values=[customerId,0,order.id,order.total,"USD", card.id,card.type, card.cardNumber,card.name,card.expirationDate,card.cvv,card.line1,card.line2,card.city,card.state,"Unitied States",card.zipcode];
    console.log(BaseDao.formatSQL(sql, values));
    connection.query(sql,values,function(error, result, fields){
        if (error) {
            return connection.rollback(function() {
                throw error;
            });
        }
        callback && callback(result.insertId);
    });
}

OrderDao.prototype.saveShippment = function(connection, customerId, order,address, callback){
    var trackingNumber = uuid.v1();
    var sql="INSERT INTO surprise.Shippment (customerId,status,orderId,shippingMethod,shippingCompany,trackingNumber,receiverName,addressLine1,addressLine2,city,state,country,zipcode,telephone,startTime,estimateTime,endTime,createdTime,lastModifiedTime)"
            +" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,? , ?, ?, ?,?,?, NOW(),NOW(),NOW(),NOW(),NOW())";
    var o = order;
    var values=[customerId,0,order.id,"COURIER","UPS", trackingNumber, address.name, address.line1, address.line2, address.city, address.state,"Unitied States",address.zipcode,address.telephone];
    console.log(BaseDao.formatSQL(sql, values));
    connection.query(sql,values,function(error, result, fields){
        if (error) {
            return connection.rollback(function() {
                throw error;
            });
        }
        callback && callback(result.insertId);
    });
}

OrderDao.prototype.saveLineItems = function(connection, customerId, order, shippmentId, cartItems, callback){
    var queries = "";
    
    for(var i=0;i<cartItems.length;i++){
        var sql="INSERT INTO surprise.LineItem (customerId, status,orderId,productSKU,shippmentId,productName,price,quantity,createdTime,lastModifiedTime)"
            +" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,NOW(),NOW());";
        var c = cartItems[i];
        var values=[customerId,0,order.id,c.sku,shippmentId,c.name, c.price, c.quantity];
        sql = BaseDao.formatSQL(sql, values);
        if(customerId!=0){
            var d ="DELETE FROM surprise.cart WHERE customerId=? AND productSKU=?;";
            values=[customerId,c.sku]
            sql += BaseDao.formatSQL(d, values);
        }
        queries+=sql
    }
    console.log(queries);
    connection.query(queries,function(error, result, fields){
        if (error) {
            return connection.rollback(function() {
                throw error;
            });
        }
        callback && callback(result);
    });
}


OrderDao.prototype.placeOrder = function(customerId, order, address, card, cartItems, callback){
    var pool = this.pool;
    var _ = this;
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            if(customerId == 0){
                //save address
                OrderDao.prototype.saveGuestAddress(connection,address,function(a){
                    address = a;
                    OrderDao.prototype.saveGuestCard(connection,card,function(c){
                        card = c;
                        OrderDao.prototype.saveOrderInfo(connection,customerId,order,address,card,cartItems,function(o){
                            order = o;
                            OrderDao.prototype.saveOrderPayment(connection, customerId,order,card,function(paymentId){
                                
                                OrderDao.prototype.saveShippment(connection, customerId, order,address,function(shippmentId){
                                       
                                    OrderDao.prototype.saveLineItems(connection, customerId, order, shippmentId, cartItems, function(){

                                        connection.commit(function(err) {
                                            if (err) {
                                                return connection.rollback(function() {
                                                    throw err;
                                                });
                                            }
                                            connection.release();
                                            callback && callback();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });      
            }else{

                OrderDao.prototype.saveOrderInfo(connection,customerId,order,address,card,cartItems,function(o){
                    order = o;
                    OrderDao.prototype.saveOrderPayment(connection, customerId,order,card,function(paymentId){
                        
                        OrderDao.prototype.saveShippment(connection, customerId, order,address,function(shippmentId){
                                
                            OrderDao.prototype.saveLineItems(connection, customerId, order, shippmentId, cartItems, function(){

                                connection.commit(function(err) {
                                    if (err) {
                                        return connection.rollback(function() {
                                            throw err;
                                        });
                                    }
                                    connection.release();
                                    callback && callback();
                                });
                            });
                        });
                    });
                });
            }
        });
    });
}


exports = module.exports = OrderDao;