var BaseDao = require("./baseDao.js");

var OrderPaymentDao = function(){
    this.table = 'OrderPayment';
}

OrderPaymentDao.prototype = Object.create(BaseDao.prototype);


OrderPaymentDao.prototype.findByCustomerId = function(id,callback){
    var sql="SELECT * FROM surprise.Order WHERE `customerId`=?  ORDER BY `createdTime` desc ;" 
    var values =[id];
    //columns, query, orderBy, limit, offset, callback
     var _=this;
    _.execute(sql,values,function(error, res){
        
        callback && callback(error, res);
    });
};

exports = module.exports = OrderPaymentDao;