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

// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
});

router.get("/",
    function(req,res){
    var hasLogin = (req.user&&req.user.type=='customer')?true:false;
    res.render("index",{hasLogin:hasLogin});
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
    res.render("myAccount");
});

router.get('/profile',auth.ensureLoggedIn(),
  function(req, res){
    res.render("profile",{profile:req.user});
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
      res.render("addressList",{addressList:address});
    });
    
});

router.get('/addAddress',auth.ensureLoggedIn(),
  function(req, res){
    // jade syntax
    res.render("address",{address:{id:"add",customerId:req.user.id}});
});

router.get('/editAddress',auth.ensureLoggedIn(),
  function(req, res){
    var id = parseInt(req.query.id);
    var customerId = req.user.id;
    address.findById(id,customerId,function(e,address){
        res.render("address",{address:address});
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
      res.render("cardList",{cardList:card});
    });
    
});

router.get('/addCard',auth.ensureLoggedIn(),
  function(req, res){
    // jade syntax
    res.render("card",{card:{id:"add",customerId:req.user.id}});
});

router.get('/editCard',auth.ensureLoggedIn(),
  function(req, res){
    var id = parseInt(req.query.id);
    var customerId = req.user.id;
    address.findById(id,customerId,function(e,address){
        res.render("card",{card:card});
    });
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

router.get('/product/:id', function(req, res){
    product.findByProductSKU(req.product.sku,function(err,product){
      res.render("productInfo",{productInfo:product}););
});

router.post('/product/:id', function(req, res){
    product.addToCart(req.product.sku,function(err,product){
      res.render("productInfo",{productInfo:product}););
});

module.exports = router;