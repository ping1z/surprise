var express = require('express');
var router = express.Router();
var auth = require('./auth');

// If the req is needed to be pre-process, do it here.
router.use(function timeLog (req, res, next) {
  next()
})
var auth = require('./auth');
router.get("/", auth.ensureLoggedIn(),
    function(req,res){
    res.sendFile(__dirname+"/views/index.html");
});

router.get('/login', function(req, res) {
   res.sendFile(__dirname+"/views/login.html");
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
    res.send(req.user );
});

module.exports = router;