var express = require('express');
var router = express.Router();
var auth = require('./auth');

var CustomerDao = require("./dao/CustomerDao.js");
var customer = new CustomerDao();

// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
})
var auth = require('./auth');

router.get("/", auth.ensureLoggedIn(),
    function(req,res){
    res.render("index");
});

router.get('/login', function(req, res) {
   res.render("login");
});

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

router.get('/profile',auth.ensureLoggedIn(),
  function(req, res){
    res.render("customer",{data:req.user});
});
router.get('/profile/edit',auth.ensureLoggedIn(),
  function(req, res){
    res.render("edit_customer",{data:req.user});
});

router.post('/profile/edit',function(req,res){
  console.log(req);
  var id = req.body.id;
  var username = req.body.username;
  var firstName = req.body.firstName;
  customer.update(id,firstName,function(error,res){
    console.log(error,res);
  });
});

router.delete('/profile/delete',function(req,res){
  customer.delete(req.user.id,function(error,res){
    console.log(error,res);
  });
});

var AddressDao = require("./dao/AddressDao.js");
var Address = new AddressDao();
router.get('/listAddress',//auth.ensureLoggedIn(),
  function(req, res){
    Address.findByCustomerId(1,function(err,address){
      res.send(address);
    });
    
});

router.get('/addAddress',//auth.ensureLoggedIn(),
  function(req, res){    
});

router.get('/deleteAddress',//auth.ensureLoggedIn(),
  function(req, res){
});

module.exports = router;