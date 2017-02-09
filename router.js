// load up all we need.
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var CustomerDao = require("./dao/customerDao.js");
var UserDao = require("./dao/userDao.js");

// create a new instance.
var customer = new CustomerDao();
var user = new UserDao();

var CustomerDao = require("./dao/CustomerDao.js");
var customer = new CustomerDao();

// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
})

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
     var telephone = req.body.telephone;
     var password = req.body.password;
     var confirmPassword = req.body.confirmPassword;

    // call signUp method and send the parameter values to the method.
    // res refers to the result from database.
    customer.signUp(email, firstName, lastName, telephone, password, function(e, r){
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

router.get('/address',auth.ensureLoggedIn(),
  function(req, res){
    res.render("address",{profile:req.user});
});

router.get('/payment',auth.ensureLoggedIn(),
  function(req, res){
    res.render("payment",{profile:req.user});
});

router.get('/listAddress',auth.ensureLoggedIn(),
  function(req, res){
    Address.findByCustomerId(1,function(err,address){
      res.send(address);
    });
});

router.get('/addAddress',auth.ensureLoggedIn(),
  function(req, res){    
});

router.get('/deleteAddress',auth.ensureLoggedIn(),
  function(req, res){
});

router.get('/profile',auth.ensureLoggedIn(),
  function(req, res){
    res.render("customer",{data:req.user});
});

router.get('/profile/edit',auth.ensureLoggedIn(),
  function(req, res){
    res.render("edit_customer",{data:req.user});
});

router.post('/profile/edit',function(req,res){

    console.log(req.body);
    var input = JSON.parse(JSON.stringify(req.body));

    //timeConvert
    var createdTimeFormat = new Date(input.createdTime);
    var lastModifiedTimeFormat = new Date(input.lastModifiedTime);
    input.createdTime = createdTimeFormat;
    input.lastModifiedTime = lastModifiedTimeFormat;

    console.log(input);
    var data = {
       id    : input.id,
       username : input.username,
       firstName   : input.firstName,
       middleName   : input.middleName,
       lastName    : input.lastName,
       email   : input.email,
       telephone   : input.telephone,
       createdTime : input.createdTime,
       lastModifiedTime    : input.lastModifiedTime
    };

    var id = req.body.id;
    customer.update(id, data,function(error,res1){
        if(error)
            console.log(error,res1);
        customer.findOneById(id, function(err, dataInfo){
            res.render("customer", {data:dataInfo});
        });
    });
});

router.get('/profile/delete',function(req,res){
  customer.delete(req.user.id,function(error,res){
    console.log(error,res);
  });
    req.logout();
    res.render('login');
});

var AddressDao = require("./dao/AddressDao.js");
var Address = new AddressDao();
router.get('/listAddress',//auth.ensureLoggedIn(),
  function(req, res){
    Address.findByCustomerId(1,function(err,address){
      res.send(address);
    });
    
});

module.exports = router;