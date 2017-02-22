// load up all we need.
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var ProductDao = require("./dao/productDao.js");
var product = new ProductDao();

// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
});

router.get("/admin",auth.ensureLoggedIn({type:"admin",redirectTo:"admin/login"}),
    function(req,res){
    var hasLogin = (req.user&&req.user.type=='admin')?true:false;
    res.render("admin",{hasLogin:false});
});

router.get('/admin/login', function(req, res) {
   res.render("admin/login");
});
//
// // send the input information back server via post. then if it failed, get back to
// // the login page. if succeeded, get back to home page.
// // the autentication of it is local.
 router.post('/admin/login',
   auth.authenticate('local.admin', { failureRedirect: '/admin/login' }),
   function(req, res) {
    res.redirect("/admin/index");
  });

router.get('/admin/logout',auth.ensureLoggedIn({type:"admin",redirectTo:"admin/login"}),
  function(req, res){
    req.logout();
    res.redirect('/admin');
});

router.get('/admin/index', function(req, res) {
    product.findAll(null,null,function(err,results) {
        res.render("admin/index",{index:results});
    });
});
 router.post('/admin/index', function(req, res) {
    var text = req.body.search;
    var gender = req.body.Gender;
    var occassions = req.body.Occassions;
    product.findone(gender , occassions , text , function(err,results) {
       // console.log(results);
        res.render("admin/index",{index:results});
    });
 });

module.exports = router;