var BaseDao = require("./baseDao.js");

var LineItemDao = function(){
    this.table = 'LineItem';
}

LineItemDao.prototype = Object.create(BaseDao.prototype);

LineItemDao.prototype.findByCustomerId = function(customerId,callback){

    var sql="SELECT l.*, p.description, p.picture, s.receiverName, s.trackingNumber"
        +" FROM surprise.LineItem l "
        +"     JOIN surprise.product p "
        +"     ON p.sku = l.productSKU "
        +"     JOIN surprise.shipment s "
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

    var sql="SELECT l.*, p.description, p.picture, p.content"
        +" FROM surprise.LineItem l "
        +"     JOIN surprise.product p "
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