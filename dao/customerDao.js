var BaseDao = require("./baseDao.js");

var CustomerDao = function(){
    this.table = 'Customer';
}
CustomerDao.prototype = Object.create(BaseDao.prototype);
CustomerDao.prototype.findOneWithPassword = function(userIdentity,callback){
    var sql = "SELECT id, username, email, telephone, password"
                +" FROM Customer join User ON Customer.id = User.customerId"
                +" WHERE username=? OR email=? OR telephone=? LIMIT 1";
    var values = [userIdentity,userIdentity,userIdentity];
    this.execute(sql, values, function(error, res){
        var item = null;
        if(res.length > 0)item = res[0];
        callback && callback(error, item);
    });
};

CustomerDao.prototype.findOneById = function(id, callback){
    this.findOne(null, "`id`=\""+id+"\"",function(error, user){
        callback && callback(error, user);
    });
};

CustomerDao.prototype.update = function(id, data, callback){
    var sql = "UPDATE Customer "
            +"SET ? "
            +"WHERE id = ?;";
    var values = [data, id];
    this.execute(sql, values, function(error, res){
        callback && callback(error, res);
    });
}

CustomerDao.prototype.delete = function(id, callback){

    //var sql = "DELETE FROM Customer "
     //   +"WHERE id = ?;";
    var sql = "DELETE customer,user FROM customer LEFT JOIN user ON customer.id=user.customerId WHERE user.customerId=?;"
    var values = id;

    this.execute(sql, values, function(error, res){
        callback && callback(error, res);
    });
}
// CustomerDao.prototype.editOne = function( req, res){
//     var id = req.user.id;

//     console.log("edit===========>" + id);
//     this.pool.getConnection(function(err, connection){

//         var query = connection.query("SELECT * FROM customer WHERE id = ?", [id], function(err, results){
//             if(err)
//                 console.log("Error edit: %s", err);

//             res.render('edit_customer',{page_title:"Edit Customers - Node.js",data:results});
//         });
//     });
// }

// CustomerDao.prototype.updateOne = function(req, res){

//     var input = JSON.parse(JSON.stringify(req.body));
//     var id = req.params.id;

//     console.log("update===========>" + id);

//     this.pool.getConnection(function(err, connection){

//         var data = {
//             id    : input.id,
//             username : input.username,
//             firstName   : input.firstName,
//             middleName   : input.middleName,
//             lastName    : input.lastName,
//             email   : input.email,
//             telephone   : input.telephone,
//             createdTime : input.createdTime,
//             lastModifiedTime    : input.lastModifiedTime
//         };

//         console.log(data);

//         var query = connection.query("UPDATE customer SET ? WHERE id = ?", [data, id], function(err, results){
//             if(err)
//             {
//                 console.log("Error Updating: %s", err);
//                 res.render('login');
//             }

//             var query = connection.query("SELECT * FROM customer WHERE id = ?", [id], function(err, results){
//                 if(err)
//                     console.log("Error edit: %s", err);

//                 res.render('customer',{page_title:"Edit Customers - Node.js",data:results[0]});
//             });
//         });
//     });
// }

// CustomerDao.prototype.deleteOne = function(req, res){
//     var id = req.params.id;
//     console.log("delete id===========>" + id);
//     this.pool.getConnection(function(err, connection){

//         connection.query("DELETE FROM customer WHERE id = ?", [id], function(err, results){
//             if(err)
//                 console.log("Error deleting : %s ",err );
//             res.redirect('/login');
//         });
//     });
// };


// CustomerDao.prototype.UpdateCustomer = function(req, res){
//     this.updateOne(req, res);
// };

// CustomerDao.prototype.DeleteCustomer = function(req, res){
//     this.deleteOne(req, res);
// };

exports = module.exports = CustomerDao;