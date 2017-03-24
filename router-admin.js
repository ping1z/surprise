// load up all we need.
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var ProductDao = require("./dao/productDao.js");
var product = new ProductDao();
var ShipmentDao = require("./dao/shipmentDao.js");
var shipment = new ShipmentDao();
var LineItemDao = require("./dao/lineItemDao.js");
var lineItem = new LineItemDao();
var ReturnDao = require("./dao/returnDao.js");
var returnDao = new ReturnDao();
// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
});

router.get("/admin",auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
    function(req,res){
    var hasLogin = (req.user&&req.user.type=='admin')?true:false;
    res.render("admin/index",{hasLogin:false});
});

router.get('/admin/login', function(req, res) {
   res.render("admin/login");
});

// send the input information back server via post. then if it failed, get back to 
// the login page. if succeeded, get back to home page.
// the autentication of it is local.
router.post('/admin/login', 
  auth.authenticate('local.admin', { failureRedirect: '/admin/login' }),
  function(req, res) {
    res.redirect('/admin');
  });

router.get('/admin/logout',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
    req.logout();
    res.redirect('/admin');
});

router.get('/admin/api/listProduct',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
    var columns = req.query.columns;
    var orderBy = req.query.orderBy;
    var page = req.query.page?parseInt(req.query.page):null;
    var count = req.query.count?parseInt(req.query.count):null;
    var occasion = req.query.occasion;
    var department = req.query.department;
    var filters = [];
    if(req.query.occasion){
      filters.push({key:"occasion",value:req.query.occasion});
    }
    if(req.query.department){
      filters.push({key:"department",value:req.query.department});
    }
    if(req.query.gender){
      filters.push({key:"gender",value:parseInt(req.query.gender)});
    }
    if(req.query.age){
      filters.push({key:"age",value:parseInt(req.query.age)});
    }
    if(req.query.price){
      filters.push({key:"price",value:parseInt(req.query.price)});
    }

    product.findByFilter(columns,filters,orderBy,page,count,function(error, result){
        res.send(result);
    });
});

router.get('/admin/api/getProduct',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
    var sku = parseInt(req.query.sku);
    
    product.findOneBySku(sku,null,function(e,result){
        res.send(result);
    });
});

router.post('/admin/api/createProduct',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){

    try{
      var name = req.body.name;
      var description = req.body.description;
      var occasion = req.body.occasion;
      var department = req.body.department;
      var gender = parseInt(req.body.gender);
      var age = parseInt(req.body.age);
      var price = parseFloat(req.body.price);
      var contents = req.body.contents;
      var quantity = parseInt(req.body.quantity);
      var picture = req.body.picture;

      if(!name){
        throw new Error('Ivalide name='+name);
      }
      if(!description){
        throw new Error('Ivalide description='+description);
      }
      if(!occasion){
        throw new Error('Ivalide occasion='+occasion);
      }
      if(!department){
        throw new Error('Ivalide department='+department);
      }
      if(isNaN(gender)){
        throw new Error('Ivalide gender='+gender);
      }
      if(isNaN(age)){
        throw new Error('Ivalide age='+age);
      }
      if(isNaN(price)){
        throw new Error('Ivalide price='+price);
      }
      if(!contents){
        throw new Error('Ivalide contents='+contents);
      }
      if(isNaN(quantity)){
        throw new Error('Ivalide quantity='+quantity);
      }
      if(!picture){
        throw new Error('Ivalide picture='+picture);
      }
      
      product.create(name,description,occasion,department,gender,age,price,contents,quantity,picture,function(e,result){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            res.send(result);
          }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    } 
});

router.post('/admin/api/updateProduct',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
    try{
      var sku = parseInt(req.body.sku);
      var name = req.body.name;
      var description = req.body.description;
      var occasion = req.body.occasion;
      var department = req.body.department;
      var gender = parseInt(req.body.gender);
      var age = parseInt(req.body.age);
      var price = parseFloat(req.body.price);
      var contents = req.body.contents;
      var quantity = parseInt(req.body.quantity);
      var picture = req.body.picture;

      if(isNaN(sku)){
        throw new Error('Ivalide sku='+sku);
      }
      if(!name){
        throw new Error('Ivalide name='+name);
      }
      if(!description){
        throw new Error('Ivalide description='+description);
      }
      if(!occasion){
        throw new Error('Ivalide occasion='+occasion);
      }
      if(!department){
        throw new Error('Ivalide department='+department);
      }
      if(isNaN(gender)){
        throw new Error('Ivalide gender='+gender);
      }
      if(isNaN(age)){
        throw new Error('Ivalide age='+age);
      }
      if(isNaN(price)){
        throw new Error('Ivalide price='+price);
      }
      if(!contents){
        throw new Error('Ivalide contents='+contents);
      }
      if(isNaN(quantity)){
        throw new Error('Ivalide quantity='+quantity);
      }
      if(!picture){
        throw new Error('Ivalide picture='+picture);
      }
      
      product.update(sku,name,description,occasion,department,gender,age,price,contents,quantity,picture,function(e,result){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            res.send(result);
          }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/admin/api/deleteProduct',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
    try{
      var sku = parseInt(req.query.sku);
      if(isNaN(sku)){
        throw new Error('Ivalide sku='+sku);
      }
      product.delete(sku,function(e,result){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            res.send(result);
          }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/admin/api/listShipment',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
    try{
      var columns = req.query.columns;
      var orderBy = "status asc, createdTime desc";
      var page = req.query.page?parseInt(req.query.page):null;
      var count = req.query.count?parseInt(req.query.count):null;
      var filters = [];
      if(req.query.status == "null")
      {
        res.send(200);
        return;
      }
      if(req.query.status){
        filters.push({key:"status",value:parseInt(req.query.status)});
      }

      shipment.findByFilter(columns,filters,orderBy,page,count,function(e, result){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            res.send(result);
          }
      });
     }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/admin/api/getShipment',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
   try{ 
      var id = parseInt(req.query.id);

      shipment.findOneWithLineItems(id,function(e,r){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            res.send(r);
          }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});


router.get('/admin/api/shippment/packed',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
   try{ 
      var id = parseInt(req.query.id);

      shipment.confirmPacked(id,function(e){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            shipment.findOneWithLineItems(id,function(err,r){
                if(err){
                  var error={msg:err.message,stack:err.stack};
                  res.send(500,error);
                }else{
                  res.send(r);
                }
            });
          }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/admin/api/shippment/shipped',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
   try{ 
      var id = parseInt(req.query.id);

      shipment.confirmShipped(id,function(e){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            shipment.findOneWithLineItems(id,function(err,r){
                if(err){
                  var error={msg:err.message,stack:err.stack};
                  res.send(500,error);
                }else{
                  res.send(r);
                }
            });
          }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/admin/api/shippment/delivered',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
   try{ 
      var id = parseInt(req.query.id);

      shipment.confirmDelivered(id,function(e){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            shipment.findOneWithLineItems(id,function(err,r){
                if(err){
                  var error={msg:err.message,stack:err.stack};
                  res.send(500,error);
                }else{
                  res.send(r);
                }
            });
          }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/admin/api/listReturn',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
    try{
      var columns = req.query.columns;
      var orderBy = "status asc, createdTime desc";
      var page = req.query.page?parseInt(req.query.page):null;
      var count = req.query.count?parseInt(req.query.count):null;
      var filters = [];
      if(req.query.status == "null")
      {
        res.send(200);
        return;
      }
      if(req.query.status){
        filters.push({key:"status",value:parseInt(req.query.status)});
      }

      returnDao.findByFilter(columns,filters,orderBy,page,count,function(e, result){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            res.send(result);
          }
      });
     }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/admin/api/getReturn',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
   try{ 
      var id = parseInt(req.query.id);

      returnDao.findOneWithJoinInfo(id,function(e,r){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            res.send(r);
          }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/admin/api/return/received',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
   try{ 
      var id = parseInt(req.query.id);

      returnDao.findOneWithJoinInfo(id,function(e,r){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            
            returnDao.confirmReceived(r,function(e){
                if(e){
                  var error={msg:e.message,stack:e.stack};
                  res.send(500,error);
                }else{
                  returnDao.findOneWithJoinInfo(id,function(e,r){
                      if(e){
                        var error={msg:e.message,stack:e.stack};
                        res.send(500,error);
                      }else{
                        res.send(r);
                      }
                  });
                }
            });
          }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/admin/api/return/refund',auth.ensureLoggedIn({type:"admin",redirectTo:"/admin/login"}),
  function(req, res){
   try{ 
      var id = parseInt(req.query.id);

      returnDao.findOneWithJoinInfo(id,function(e,r){
          if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            
            returnDao.confirmRefund(r,function(e){
                if(e){
                  var error={msg:e.message,stack:e.stack};
                  res.send(500,error);
                }else{
                  returnDao.findOneWithJoinInfo(id,function(e,r){
                      if(e){
                        var error={msg:e.message,stack:e.stack};
                        res.send(500,error);
                      }else{
                        res.send(r);
                      }
                  });
                }
            });
          }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

module.exports = router;