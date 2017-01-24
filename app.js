
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var UserDao = require("./dao/userDao.js");
var User = new UserDao();

passport.use(new LocalStrategy(
  function(userId, password, done) {
    User.findByUserId(userId,function(err, user){
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password!=password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.userId);
});

passport.deserializeUser(function(id, cb) {
  User.findByUserId(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var express = require('express');
var app = express();
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'cs6360', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", ensureLoggedIn, 
    function(req,res){
    res.sendFile(__dirname+"/views/index.html");
});

app.get('/login', function(req, res) {
  res.sendFile(__dirname+"/views/login.html");
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout',ensureLoggedIn,
  function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/profile',ensureLoggedIn,
  function(req, res){
    res.send(req.user );
  });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})