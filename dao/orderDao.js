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
OrderDao.prototype.saveOrderInfo = function(connection, customerId, order,address,card, items, callback){
    var trackingNumber = uuid.v1();
    var sql="INSERT INTO surprise.Order (customerId,status,addressId,cardId,totalBeforeTax,tax,taxRate, shippingCost,lineItemCount,trackingNumber, createdTime,lastModifiedTime)"
            +" VALUES ( ?, ?, ?, ?, ?, ?,?, ?, ?,?,NOW(),NOW())";
    var o = order;
    var values=[customerId, 0, address.id, card.id, o.totalBeforeTax,o.tax,o.taxRate,o.shippingCost,items.length,trackingNumber];
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

OrderDao.prototype.saveShipment = function(connection, customerId, order,address, callback){
    var trackingNumber = uuid.v1();
    var sql="INSERT INTO surprise.Shipment (customerId,status,orderId,shippingMethod,shippingCompany,trackingNumber,receiverName,addressLine1,addressLine2,city,state,country,zipcode,telephone,packedTime,shippedTime,deliveredTime,estimatedTime,createdTime,lastModifiedTime)"
            +" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,? , ?, ?, ?,?,?, null,null,null,null,NOW(),NOW())";
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

OrderDao.prototype.saveLineItems = function(connection, customerId, order, shipmentId, items, callback){
    var queries = "";
    
    for(var i=0;i<items.length;i++){
        var sql="INSERT INTO surprise.LineItem (customerId, status,orderId,productSKU,shipmentId,productName,price,quantity,createdTime,lastModifiedTime)"
            +" VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,NOW(),NOW());";
        var c = items[i];
        var values=[customerId,0,order.id,c.sku,shipmentId,c.name, c.price, c.quantity];
        sql = BaseDao.formatSQL(sql, values);
        if(customerId!=0){
            var d ="DELETE FROM surprise.Cart WHERE customerId=? AND productSKU=?;";
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

OrderDao.prototype.updateProductQuantity = function(connection, items, callback){
    var queries = "";
    
    for(var i=0;i<items.length;i++){
        var sql="UPDATE surprise.Product SET quantity=quantity-?"
        +" WHERE sku=?;";
        var c = items[i];
        var values=[c.quantity,c.sku];
        sql = BaseDao.formatSQL(sql, values);
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

OrderDao.prototype.placeOrder = function(customerId, order, address, card, items, callback){
    var pool = this.pool;
    var _ = this;
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            if(customerId == 0){
                //save address
                _.updateProductQuantity(connection, items, function(){
                    _.saveGuestAddress(connection,address,function(a){
                        address = a;
                        _.saveGuestCard(connection,card,function(c){
                            card = c;
                            _.saveOrderInfo(connection,customerId,order,address,card,items,function(o){
                                order = o;
                                _.saveOrderPayment(connection, customerId,order,card,function(paymentId){
                                    
                                    _.saveShipment(connection, customerId, order,address,function(shipmentId){
                                        
                                        _.saveLineItems(connection, customerId, order, shipmentId, items, function(){

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
                })
                
            }else{
                _.updateProductQuantity(connection, items, function(){
                    _.saveOrderInfo(connection,customerId,order,address,card,items,function(o){
                        order = o;
                        _.saveOrderPayment(connection, customerId,order,card,function(paymentId){
                            
                            _.saveShipment(connection, customerId, order,address,function(shipmentId){
                                    
                                _.saveLineItems(connection, customerId, order, shipmentId, items, function(){

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
            }
        });
    });
}


OrderDao.prototype.findById = function(customerId,orderId,callback){
    //columns, query, orderBy, limit, offset, callback
    // var sql ="SELECT * FROM "+
    // "(SELECT * FROM surprise.LineItem WHERE `customerId`=?) c "
    // +"INNER JOIN (SELECT sku, name, description, contents, picture FROM surprise.product) p "
    // +"ON c.productSKU = p.sku "
    // +"INNER JOIN (SELECT receiverName FROM surprise.shipment) s "
    // +"ON c.orderId = s.orderId";

    var sql="SELECT o.*, s.*, op.*, l.*, p.description, p.picture"
        +" FROM surprise.Order o "
        +"     JOIN surprise.Shipment s "
        +"     ON s.customerId = o.customerId and s.orderId = o.id "
        +"     JOIN Orderpayment op "
        +"     ON op.customerId = o.customerId and op.orderId = o.id "
        +"     JOIN surprise.Lineitem l "
        +"     ON l.customerId = o.customerId and l.orderId = o.id "  
        +"     JOIN surprise.Product p "
        +"     ON p.sku = l.productSKU "                       
        +" WHERE o.customerId=? and o.id=?" ;

    var values=[customerId,orderId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("findById",error,res);
        callback && callback(error, res);
    });
};

exports = module.exports = OrderDao;