// load up all we need.
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var CustomerDao = require("./dao/customerDao.js");
var customer = new CustomerDao();
var AddressDao = require("./dao/addressDao.js");
var address = new AddressDao();
var CardDao = require("./dao/cardDao.js");
var card = new CardDao();
var ProductDao = require("./dao/productDao.js");
var product = new ProductDao();
var CartDao = require("./dao/cartDao.js");
var cart = new CartDao();
// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
});

router.get("/",
    function(req,res){
      var hasLogin = (req.user&&req.user.type=='customer')?true:false;
      if(!hasLogin){
        res.render("index",{hasLogin:hasLogin});
      }else{
        cart.getCartItemCount(req.user.id,function(error, count){
          res.render("index",{hasLogin:hasLogin,cartCount:count});
        })
      }
});

router.post('/signUp', 
  function(req, res) {
    // get data from request.
    // get data enclosed in the json body of the request message from the submit of a web form.
     var email = req.body.email;
     var firstName = req.body.firstName;
     var lastName = req.body.lastName;
     var password = req.body.password;
     var confirmPassword = req.body.confirmPassword;

     if(password!=confirmPassword){
       res.render('login');    
     }
     auth.generateHash(password,function(error,hash){
        // call signUp method and send the parameter values to the method.
        // res refers to the result from database.
        customer.signUp(email, firstName, lastName, hash, function(e, r){
          res.render('login');    
        });
     });
  });

router.get('/login', function(req, res) {
   res.render("login");
});

// send the input information back server via post. then if it failed, get back to 
// the login page. if succeeded, get back to home page.
// the autentication of it is local.
router.post('/login', 
  auth.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout',auth.ensureLoggedIn(),
  function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/myAccount',auth.ensureLoggedIn(),
  function(req, res){
    cart.getCartItemCount(req.user.id,function(error, count){
          res.render("myAccount",{hasLogin:true,cartCount:count});
    })
});

router.get('/profile',auth.ensureLoggedIn(),
  function(req, res){
    cart.getCartItemCount(req.user.id,function(error, count){
          res.render("profile",{hasLogin:true,cartCount:count,profile:req.user});
    })
});

router.post('/updateProfile',auth.ensureLoggedIn(),
  function(req, res){
     var id = req.body.id;
     if(id!=req.user.id){
       res.redirect('profile');
     }
     var firstName = req.body.firstName;
     var middleName = req.body.middleName;
     var lastName = req.body.lastName;
     customer.update(id, firstName, middleName, lastName, function(e, r){
        res.redirect('profile');
    });
});

router.get('/deleteProfile',auth.ensureLoggedIn(),
  function(req, res){
     var id = req.user.id;
     customer.delete(id, function(e, r){
      req.logout();
      res.redirect('/');
    });
});

router.get('/listAddress',auth.ensureLoggedIn(),
  function(req, res){
    address.findByCustomerId(req.user.id,function(err,address){
        cart.getCartItemCount(req.user.id,function(err, count){
            res.render("addressList",{hasLogin:true,cartCount:count,addressList:address});
        })
    });
});

router.get('/addAddress',auth.ensureLoggedIn(),
  function(req, res){
    cart.getCartItemCount(req.user.id,function(err, count){
            res.render("address",{hasLogin:true,cartCount:count,address:{id:"add",customerId:req.user.id}});
    })
});

router.get('/editAddress',auth.ensureLoggedIn(),
  function(req, res){
    var id = parseInt(req.query.id);
    var customerId = req.user.id;
    address.findById(id,customerId,function(e,address){
        cart.getCartItemCount(req.user.id,function(err, count){
            res.render("address",{hasLogin:true,cartCount:count,address:address});
        })
    });
});

router.post('/saveAddress',auth.ensureLoggedIn(),
  function(req, res){
    var customerId = parseInt(req.body.customerId);
    if(customerId!=req.user.id){
      res.redirect('listAddress');
    }
    var id = req.body.id;
    var name = req.body.name;
    var line1 = req.body.line1;
    var line2 = req.body.line2;
    var city = req.body.city;
    var state = req.body.state;
    var country = req.body.country;
    var zipcode = req.body.zipcode;
    var telephone = req.body.telephone;
    if(!id||id=="add"){
       address.addAddress(customerId,name,line1,line2,city,state,country,zipcode,telephone,function(e,r){
          res.redirect('listAddress');
      });
    }else{
       address.updateAddress(id,name,line1,line2,city,state,country,zipcode,telephone,function(e,r){
          res.redirect('listAddress');
      });
    }
});



router.get('/setAsDefaultAddress',auth.ensureLoggedIn(),
  function(req, res){
    var id = parseInt(req.query.id);
    var customerId = req.user.id;
    address.setAsDefault(id,customerId,function(e,r){
          res.redirect('listAddress');
    });
});
router.get('/deleteAddress',auth.ensureLoggedIn(),
  function(req, res){
    var id = parseInt(req.query.id);
    var customerId = req.user.id;
    address.deleteAddress(id,customerId,function(e,r){
          res.redirect('listAddress');
    });
});

router.get('/listCard',auth.ensureLoggedIn(),
  function(req, res){
    card.findByCustomerId(req.user.id,function(err,card){
        cart.getCartItemCount(req.user.id,function(err, count){
            res.render("cardList",{hasLogin:true,cartCount:count,cardList:card});
        })
    });
    
});

router.get('/addCard',auth.ensureLoggedIn(),
  function(req, res){
    cart.getCartItemCount(req.user.id,function(err, count){
        res.render("card",{hasLogin:true,cartCount:count,card:{id:"add",customerId:req.user.id}});
    })
});

router.post('/saveCard',auth.ensureLoggedIn(),
  function(req, res){
    var customerId = parseInt(req.body.customerId);
    if(customerId!=req.user.id){
      res.redirect('listCard');
    }
    var id = req.body.id;
    var type = req.body.type;
    var name = req.body.name;
    var cardNumber = req.body.cardNumber;
    var line1 = req.body.line1;
    var line2 = req.body.line2;
    var city = req.body.city;
    var state = req.body.state;
    var zipcode = req.body.zipcode;
    var expirationDate = req.body.expirationDate;
    var cvv = req.body.cvv;

    auth.generateHash(cvv,function(error,hash){
        if(!id||id=="add"){
          card.addCard(customerId,type,name,cardNumber,line1,line2,city,state,zipcode,expirationDate,hash,function(e,r){
              res.redirect('listCard');
          });
        }else{
          card.updateCard(id,type,name,cardNumber,line1,line2,city,state,zipcode,expirationDate,hash,function(e,r){
              res.redirect('listCard');
          });
        }
     });
});

router.get('/setAsDefaultCard',auth.ensureLoggedIn(),
  function(req, res){
    var id = parseInt(req.query.id);
    var customerId = req.user.id;
    card.setAsDefault(id,customerId,function(e,r){
          res.redirect('listCard');
    });
});
router.get('/deleteCard',auth.ensureLoggedIn(),
  function(req, res){
    var id = parseInt(req.query.id);
    var customerId = req.user.id;
    card.deleteCard(id,customerId,function(e,r){
          res.redirect('listCard');
    });
  
});

router.get('/searchProduct',
  function(req, res){
    var keyword = req.query.keyword;
    var hasLogin = (req.user&&req.user.type=='customer')?true:false;
    product.search(keyword,function(e,r){
          if(!hasLogin){
              res.render("productList",{hasLogin:true,cartCount:0,productList:r});
          }else{
              cart.getCartItemCount(req.user.id,function(err, count){
                res.render("productList",{hasLogin:true,cartCount:0,productList:r});
              })
          }
    });
});

router.get('/productDetail',
  function(req, res){
    var sku = req.query.sku;
    var hasLogin = (req.user&&req.user.type=='customer')?true:false;
    product.findOneBySku(sku,"sku,name,description,occasion,department,gender,age,price,quantity,picture",function(e,r){
          if(!hasLogin){
              res.render("productDetail",{hasLogin:true,cartCount:0,product:r});
          }else{
              cart.getCartItemCount(req.user.id,function(err, count){
                res.render("productDetail",{hasLogin:true,cartCount:count,product:r});
              })
          }
    });
});

router.get('/addToCart',auth.ensureLoggedIn(),
  function(req, res){
    var sku = req.query.sku;
    cart.addToCart(req.user.id,sku,function(err,r){
        res.redirect('/productDetail?sku='+sku);
    });
});

router.get('/myShoppingCart',auth.ensureLoggedIn(),
  function(req, res){
    cart.findByCustomerId(req.user.id,function(err,cart){
        var totalPrice=0;
        for(var i=0;i<cart.length;i++){
          totalPrice+=cart[i].price*cart[i].quantity;
        }
        res.render("myCart",{hasLogin:true,cartCount:cart.length,totalPrice:totalPrice,cartList:cart, });
    });
});

router.get('/deleteFromCart',auth.ensureLoggedIn(),
  function(req, res){
    var id = req.query.id;
    cart.deleteCart(id, req.user.id,function(err,cart){
        res.redirect('myShoppingCart');
    });
});


router.get('/updateCartItemQuantity',auth.ensureLoggedIn(),
  function(req, res){
    var id = req.query.id;
    var quantity = req.query.quantity;
    cart.updateQuantity(id, req.user.id, quantity, function(err,cart){
        res.redirect('myShoppingCart');
    });
});

router.get('/checkout',//auth.ensureLoggedIn(),
  function(req, res){
    var sku = req.query.sku?req.query.sku:null;
    var hasLogin = (req.user&&req.user.type=='customer')?true:false;
    if(hasLogin){
       if(sku){
          res.render("checkout",{sku:sku, checkoutCount:1, customerId:req.user.id});
       }else{
        cart.getCartItemCount(req.user.id,function(err, count){
            res.render("checkout",{sku:'', checkoutCount:count, customerId:req.user.id});
         })
       }
    }else{
       res.render("checkout",{sku:sku,checkoutCount:1,customerId:"guest"});
    }
    
});

//api
router.get('/api/listAddress',auth.ensureLoggedIn(),
  function(req, res){
    try{
      var customerId = parseInt(req.query.customerId);
      if(customerId!=req.user.id){
        throw new Error('Ivalide customerId='+customerId);
      }
      address.findByCustomerId(customerId,function(e,result){
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


router.post('/api/addAddress',auth.ensureLoggedIn(),
  function(req, res){
    try{
      var id = req.body.id;
      var name = req.body.name;
      var line1 = req.body.line1;
      var line2 = req.body.line2;
      var city = req.body.city;
      var state = req.body.state;
      var country = req.body.country;
      var zipcode = req.body.zipcode;
      var telephone = req.body.telephone;
      address.addAddress(req.user.id,name,line1,line2,city,state,country,zipcode,telephone,function(e,r){
         if(e){
            var error={msg:e.message,stack:e.stack};
            res.send(500,error);
          }else{
            res.send(200,r);
          }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/api/listCard',auth.ensureLoggedIn(),
  function(req, res){
    try{
      var customerId = parseInt(req.query.customerId);
      if(customerId!=req.user.id){
        throw new Error('Ivalide customerId='+customerId);
      }
      card.findByCustomerId(customerId,function(e,result){
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

router.post('/api/addCard',auth.ensureLoggedIn(),
  function(req, res){
    try{
      var id = req.body.id;
      var type = req.body.type;
      var name = req.body.name;
      var cardNumber = req.body.cardNumber;
      var line1 = req.body.line1;
      var line2 = req.body.line2;
      var city = req.body.city;
      var state = req.body.state;
      var zipcode = req.body.zipcode;
      var expirationDate = req.body.expirationDate;
      var cvv = req.body.cvv;

      auth.generateHash(cvv,function(error,hash){
          card.addCard(req.user.id,type,name,cardNumber,line1,line2,city,state,zipcode,expirationDate,hash,function(e,r){
                if(e){
                  var error={msg:e.message,stack:e.stack};
                  res.send(500,error);
                }else{
                  res.send(200,r);
                }
          });
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/api/getProductDetail',
  function(req, res){
    try{
      var sku = req.query.sku;
      product.findOneBySku(sku,"sku,name,description,occasion,department,gender,age,price,quantity,picture",function(e,r){
            if(e){
              var error={msg:e.message,stack:e.stack};
              res.send(500,error);
            }else{
              res.send(200,r);
            }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.get('/api/listCart',auth.ensureLoggedIn(),
  function(req, res){
    try{
      var customerId = parseInt(req.query.customerId);
      if(customerId!=req.user.id){
        throw new Error('Ivalide customerId='+customerId);
      }
      cart.findByCustomerId(req.user.id,function(e,r){
            if(e){
              var error={msg:e.message,stack:e.stack};
              res.send(500,error);
            }else{
              res.send(200,r);
            }
      });
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

router.post('/api/placeOrder',auth.ensureLoggedIn(),
  function(req, res){
    try{
      var address = JSON.parse(req.body.address);
      var card = JSON.parse(req.body.card);
      var cartItems = JSON.parse(req.body.cartItems);
      res.send(200,{
          address:address,
          card:card,
          cartItems:cartItems
        }
      );
    }catch(e){
      var error={msg:e.message,stack:e.stack};
      res.send(500,error);
    }
});

module.exports = router;