var BaseDao = require("./baseDao.js");

var AddressDao = function(){
    this.table = 'Address';
}
AddressDao.prototype = Object.create(BaseDao.prototype);
AddressDao.prototype.findByCustomerId = function(id,callback){
    //columns, query, orderBy, limit, offset, callback
    this.find(null, "`customerId`=\""+id+"\"",null, null, null,function(error, addr){
        console.log(error);
        callback && callback(error, addr);
    });
};
exports = module.exports = AddressDao;