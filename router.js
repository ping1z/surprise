var express = require('express');
var router = express.Router();
var auth = require('./auth');

// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
})
var auth = require('./auth');

router.get("/",
    function(req,res){
    var hasLogin = req.user?true:false;
    res.render("index",{hasLogin:hasLogin});
});

router.get('/login', function(req, res) {
   res.render("login");
});

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