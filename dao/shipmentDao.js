var BaseDao = require("./baseDao.js");

var ShipmentDao = function(){
    this.table = 'Shipment';
}
ShipmentDao.prototype = Object.create(BaseDao.prototype);

ShipmentDao.prototype.findByFilter = function(columns, filters, orderBy, page, count, callback){
    var query = '';
    for(var i=0;i<filters.length;i++){
        if(query)query+=" AND ";

        query+="`"+filters[i].key+"`=";
        if(typeof filters[i].value == 'string'){
            query+="\""+filters[i].value+"\"";
        }else{
            query+=filters[i].value;
        }
    }
    this.findByPage(columns, query, orderBy, page, count,function(error, results){
        console.log(error);

        callback && callback(error, results);
    });
}

ShipmentDao.prototype.findOneById = function(id, callback){
    //columns, query, orderBy, limit, offset, callback
    this.findOne(null, "`id`=\""+id+"\"",function(error, addr){
        console.log(error);
        callback && callback(error, addr);
    });
};

exports = module.exports = ShipmentDao;