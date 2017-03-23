var BaseDao = require("./baseDao.js");

var ShipmentDao = function(){
    this.table = 'Shipment';
}

ShipmentDao.prototype = Object.create(BaseDao.prototype);


ShipmentDao.prototype.findById = function(customerId,orderId,callback){
    var sql="SELECT * FROM surprise.Shhipment WHERE `customerId`=? and `orderId`=?;" 
    var values =[customerId,orderId];
    //columns, query, orderBy, limit, offset, callback
     var _=this;
    _.execute(sql,values,function(error, res){
        
        callback && callback(error, res);
    });
};

exports = module.exports = ShipmentDao;