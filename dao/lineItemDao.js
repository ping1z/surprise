var BaseDao = require("./baseDao.js");

var LineItemDao = function(){
    this.table = 'LineItem';
}

LineItemDao.prototype = Object.create(BaseDao.prototype);

LineItemDao.prototype.findByCustomerId = function(customerId,callback){
    //columns, query, orderBy, limit, offset, callback
    // var sql ="SELECT * FROM "+
    // "(SELECT * FROM surprise.LineItem WHERE `customerId`=?) c "
    // +"INNER JOIN (SELECT sku, name, description, contents, picture FROM surprise.product) p "
    // +"ON c.productSKU = p.sku "
    // +"INNER JOIN (SELECT receiverName FROM surprise.shipment) s "
    // +"ON c.orderId = s.orderId";

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

exports = module.exports = LineItemDao;