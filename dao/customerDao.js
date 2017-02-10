var BaseDao = require("./baseDao.js");

var CustomerDao = function(){
    this.table = 'Customer';
}

CustomerDao.prototype = Object.create(BaseDao.prototype);
CustomerDao.prototype.findOneWithPassword = function(userIdentity,callback){
    var sql = "SELECT id, email, password"
                +" FROM Customer join User ON Customer.id = User.customerId"
                +" WHERE email=? LIMIT 1";
    var values = [userIdentity];
    this.execute(sql, values, function(error, res){
        var item = null;
        if(res.length > 0)item = res[0];
        callback && callback(error, item);
    });
};

// get current time method: GETDATE().
// callback refers to the function in router.js, 
// when the result is generated, it will callback the function in router.js.
CustomerDao.prototype.signUp = function(email, firstName, lastName, password,callback){
    var pool = this.pool;
    var _ = this;
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            var sql="INSERT INTO surprise.Customer (email, firstName, lastName, createdTime)"
                +" VALUES ( ?, ?, ?, NOW())"
            var values=[email,firstName,lastName];
            connection.query(sql,values,function(error, results, fields){
                console.log(1,error,results,results.affectedRows!=1);
                if (error) {
                    return connection.rollback(function() {
                        throw error;
                    });
                }
                if(results.affectedRows!=1){
                    return connection.rollback(function() {
                        throw new Error('Insert Customer Failed: '+sql);
                    });
                }
                var newCustomId = results.insertId;
                
                sql="INSERT INTO surprise.User (customerId, password)"
                +" VALUES ( ?, ?)"
                values=[newCustomId,password];
                connection.query(sql,values,function(e, r, f){
                    if (e) {
                        return connection.rollback(function() {
                            throw error;
                        });
                    }
                    if(r.affectedRows!=1){
                        return connection.rollback(function() {
                            throw new Error('Insert User Failed: '+sql);
                        });
                    }
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                throw err;
                            });
                        }
                        connection.release();
                        callback && callback(err);
                    });
                });
            });
        });
    });
}

CustomerDao.prototype.update = function(id, firstName, middleName, lastName, callback){
    var sql="UPDATE Customer SET firstName=?, middleName=?, lastName=?, lastModifiedTime=NOW()"
          +" WHERE id=?"
    var values=[firstName, middleName, lastName,  parseInt(id)];
    var _ = this;
    _.execute(sql,values,function(error, res){
        console.log(1,error,res,res.affectedRows!=1);
        callback && callback(error, res);
    });
}

CustomerDao.prototype.findOneById = function(id,callback){
    this.findOne(null, "`id`=\""+id+"\"",function(error, user){
        callback && callback(error, user);
    });
};

exports = module.exports = CustomerDao;