var BaseDao = require("./baseDao.js");

var ProductDao = function(){
    this.table = 'Product';
}
ProductDao.prototype = Object.create(BaseDao.prototype);

ProductDao.prototype.findByFilter = function(columns, filters, orderBy, page, count, callback){
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

ProductDao.prototype.findOneBySku = function(sku, columns, callback){
    //columns, query, orderBy, limit, offset, callback
    this.findOne(columns, "`sku`=\""+sku+"\"",function(error, addr){
        console.log(error);
        callback && callback(error, addr);
    });
};

ProductDao.prototype.create = function(name,description,occasion,department,gender,age,price,contents,quantity,picture,callback){
    var sql="INSERT INTO surprise.Product (name,description,occasion,department,gender,age,price,contents,quantity,picture,createdTime,lastModifiedTime)"
          +" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
    var values=[name,description,occasion,department,gender,age,price,contents,quantity,picture];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("create product",error,res);
        callback && callback(error, res);
    });
};

ProductDao.prototype.update = function(sku,name,description,occasion,department,gender,age,price,contents,quantity,picture,callback){
    var sql="UPDATE surprise.Product SET name=?, description=?, occasion=?, department=?, gender=?, age=?, price=?, contents=?, quantity=?,picture=?,lastModifiedTime=NOW()"
          +" WHERE sku=?";
    var values=[name,description,occasion,department,gender,age,price,contents,quantity,picture,sku];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("update product",error,res);
        callback && callback(error, res);
    });
};
ProductDao.prototype.delete = function(sku,callback){
    var sql="DELETE FROM surprise.Product WHERE sku=?";
    var values=[sku];
    var _=this;
    _.execute(sql,values,function(error, res){
        console.log("delete product",error,res);
        callback && callback(error, res);
    });
};

ProductDao.prototype.search = function(keyword,callback){
    var sql="SELECT sku,name,description,occasion,department,gender,age,price,quantity,picture FROM surprise.Product WHERE `name` LIKE '%"+keyword+"%' OR `description` LIKE '%"+keyword+"%';";
    var _=this;
    _.execute(sql,[],function(error, res){
        console.log("search product",error,res);
        callback && callback(error, res);
    });
};

exports = module.exports = ProductDao;