var mysql = require('mysql');
var BaseDao = function(){
    this.table= '';
}
BaseDao.prototype.pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'root123',
  database : 'surprise'
});
var SQLAction = {
    SELECT:"SELECT",
    DELETE:"DELETE",
    UPDATE:"UPDATE",
    INSERT:"INSERT"
}
var SQLBuilder = function(){
    //this.builder = this;
    this.table = "";
    this.columns = "";
    this.query = "";
    this.sorts = "";
    this.limit = "";
    this.offset = "";
    this.action = null;//select, delete, update, insert
}
SQLBuilder.prototype.select = function(columns){
    this.action = SQLAction.SELECT;
    if(!columns)this.columns = "*";return this;

    if(typeof columns == "string"){
        columns = columns.split(',');
    }
    if(Array.isArray(columns) == false){
        throw new Error("Invalid input value.",columns);
    }
    var cols = "";
    columns.forEach(function(c){
        c = c.trim();
        if(c){
            cols += "`"+c+"`";
        }
    })
    this.columns = cols;
    return this;
}
SQLBuilder.prototype.from = function(table){
    if(!table){
        throw  new Error("Invalid input value.",table);
    }
    this.table = table;
    return this;
}
SQLBuilder.prototype.where = function(query){
    if(!query)return this;
    this.query = " WHERE "+query + " ";
    return this;
}
SQLBuilder.prototype.orderBy = function(sorts){
    if(!sorts)return this;
    this.sorts = " ORDER BY "+sorts + " ";
    return this;
}
SQLBuilder.prototype.setLimit = function(limit){
    if(!limit)return this;
    if(!Number.isInteger(limit) ||  limit <= 0){
        throw Error("Invalid input value.",limit);
    }
    this.limit = " LIMIT "+ limit + " ";
    return this;
}
SQLBuilder.prototype.setOffset = function(offset){
    if(!offset)return this;
    if(!Number.isInteger(offset) ||  offset <= 0){
        throw Error("Invalid input value.",offset);
    }
    this.offset = " OFFSET "+ offset + " ";
    return this;
}
SQLBuilder.prototype.toSQL = function(){
    if(!this.action){
        throw Error("Can not complie Unknow SQLAction.");
    }
    var sql = "";
    
    if(this.action == SQLAction.SELECT){
        sql = "SELECT " + this.columns + " FROM " + this.table + this.query + this.sorts + this.limit + this.offset;
    }
    return sql;
}

BaseDao.prototype.find = function(columns, query, orderBy, limit, offset, callback){
    var sqlBuilder = new SQLBuilder();
    sqlBuilder.select(columns).from(this.table).where(query).orderBy(orderBy).setLimit(limit).setOffset(offset);
    var sql = sqlBuilder.toSQL();
    console.log(sql);
    this.pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(sql, function (error, results, fields) {
    
            // And done with the connection.
            connection.release();

            callback && callback (error, results);
            // Don't use the connection here, it has been returned to the pool.
        });
    });
};

BaseDao.prototype.findOne = function(columns, query, callback){
    this.find(columns,query,null,1,null,function(error, results){
        var item = null;
        if(results.length > 0)item = results[0];
        callback && callback(error, results[0]);
    });
};

BaseDao.prototype.findAll = function(columns, orderBy, callback){
    this.find(columns, null, orderBy, null, null, function(rerror, esults){
        callback && callback(error, results);
    });
};
exports = module.exports = BaseDao;