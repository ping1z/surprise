var BaseDao = require("./baseDao.js");

var LineItemDao = function(){
    this.table = 'LineItem';
}

LineItemDao.prototype = Object.create(BaseDao.prototype);

LineItemDao.prototype.findOneByIdAndUser = function(id, customerId, callback){
    //columns, query, orderBy, limit, offset, callback
    this.findOne(null, "`id`="+id+" AND `customerId`="+ customerId,function(error, addr){
        console.log(error);
        callback && callback(error, addr);
    });
};

LineItemDao.prototype.findByMultiId = function(ids, status, callback){

    var sql="SELECT l.*, p.description, p.picture, p.contents, o.addressId, o.cardId"
        +" FROM LineItem l "
        +"     JOIN Product p "
        +"     ON p.sku = l.productSKU "
        +"     JOIN order o "
        +"     ON o.id = l.orderId "
        +" WHERE l.status=? AND l.id IN(?)";

    var values=[status, ids];
    console.log(BaseDao.formatSQL(sql, values));
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("findByMultiId",error,res);
        callback && callback(error, res);
    });
};

LineItemDao.prototype.findByCustomerId = function(customerId,callback){

    var sql="SELECT l.*, p.description, p.picture, s.receiverName, s.trackingNumber, s.packedTime, s.shippedTime, s.deliveredTime, s.estimatedTime"
        +" FROM LineItem l "
        +"     JOIN Product p "
        +"     ON p.sku = l.productSKU "
        +"     JOIN shipment s "
        +"     ON s.orderId = l.orderId "
        +" WHERE l.customerId=?";

    var values=[customerId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("findByCustomerId",error,res);
        callback && callback(error, res);
    });
};

LineItemDao.prototype.findByShipmentId = function(shipmentId,callback){

    var sql="SELECT l.*, p.description, p.picture, p.contents"
        +" FROM LineItem l "
        +"     JOIN Product p "
        +"     ON p.sku = l.productSKU "
        +" WHERE l.shipmentId=?";
    var values=[shipmentId];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("findByShipmentId",error,res);
        callback && callback(error, res);
    });
};

exports = module.exports = LineItemDao;