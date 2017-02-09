// load up all we need.
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var CustomerDao = require("./dao/customerDao.js");
var customer = new CustomerDao();
var AddressDao = require("./dao/addressDao.js");
var address = new AddressDao();

// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
});

router.get("/",
    function(req,res){
    var hasLogin = req.user?true:false;
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

    // call signUp method and send the parameter values to the method.
    // res refers to the result from database.
    customer.signUp(email, firstName, lastName, password, function(e, r){
      res.render('login');    
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

router.get('/listAddress',auth.ensureLoggedIn(),
  function(req, res){
    address.findByCustomerId(req.user.id,function(err,address){
      res.render("addressList",{addressList:address});
    });
    
});

router.get('/addAddress',auth.ensureLoggedIn(),
  function(req, res){
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
    if(!id||id=="add"){
       address.addAddress(customerId,name,line1,line2,city,state,country,zipcode,function(e,r){
          res.redirect('listAddress');
      });
    }else{
       address.updateAddress(id,name,line1,line2,city,state,country,zipcode,function(e,r){
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


router.get('/payment',auth.ensureLoggedIn(),
  function(req, res){
    res.render("payment",{profile:req.user});
});


module.exports = router;