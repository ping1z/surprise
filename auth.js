var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var UserDao = require("./dao/userDao.js");
var User = new UserDao();

var Authorize = function(){
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
  console.log("Authorize init.");
}

Authorize.prototype.init = function(app){
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({ secret: 'cs6360', resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());
};

Authorize.prototype.ensureLoggedIn = function(){
  return ensureLoggedIn;
};

Authorize.prototype.authenticate = function(type, opt){
  return passport.authenticate(type, opt);
};

module.exports = new Authorize();