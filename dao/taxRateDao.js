var BaseDao = require("./baseDao.js");

var TaxRateDao = function(){
    this.table = 'TaxRate';
}

TaxRateDao.prototype = Object.create(BaseDao.prototype);
TaxRateDao.prototype.getTaxRate = function(state,callback){
    var sql="SELECT * FROM surprise.TaxRate WHERE id=? OR id='OTHERS'";
    var values=[state.toUpperCase()];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("getTaxRate",error,res);
        if(res.length==1){
           callback && callback(error, res[0].rate);
        }else if(res.length>1){
            for(var i=0;i<res.length;i++){
                if(res[i].id!="OTHERS"){
                   callback && callback(error, res[i].rate);
                }
            }
        }else{
            callback && callback(error, null);  
        }   
    });
}

exports = module.exports = TaxRateDao;