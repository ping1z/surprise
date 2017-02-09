// load up all we need.
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var CustomerDao = require("./dao/customerDao.js");

// create a new instance.
var customer = new CustomerDao();

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

router.get('/createaccount', function(req, res) {
   res.render("createaccount");
});

router.post('/createaccount', 
  //auth.authenticate('local', { failureRedirect: '/createaccount' }),
  function(req, res) {
    console.log(req); 

    // get data enclosed in the json body of the request message from the submit of a web form.
     var username = req.body.Username;
     var email = req.body.Email;
     var firstName = req.body.Firstname;
     var lastName = req.body.Lastname;
     var password = req.body.Password;

    // call signUp method and send the parameter values to the method.
    // res refers to the result from database.
    customer.signUp(username,email,firstName,lastName,password,function(error, res){
     var sql = "SELECT id FROM surprise.customer WHERE email = ?;"
     var values = [email];
     customer.execute(sql,values,function(error, res){
         console.log(res);
     });
    });

    res.redirect('/login');    
  });

router.get('/login', function(req, res) {
   res.render("login");
});

// send the input information back server via post. then if it failed, get back to 
//  the login page. if succeeded, get back to home page.
// the autentication of it is local.
router.post('/login', 
  auth.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/signOut',auth.ensureLoggedIn(),
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

module.exports = router;