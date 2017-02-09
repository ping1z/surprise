var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

// Configuration for passport-local module
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

// load up the models we need: CustomerDao model.
var CustomerDao = require("./dao/CustomerDao.js");

// create a new instance
var Customer = new CustomerDao();


// passport session setup
//  required for persistent login sessions
// passport needs ability to serialize and unserialize users
// out of session.

// local login
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called "local"
var Authorize = function(){
  // by default, usernameField is username, here we change parameters - usernameField
  //  is userIdentity. It could be one of username, email, telephone.
  passport.use(new LocalStrategy({
      usernameField: 'userIdentity',
      passwordField: 'password',
    },
    function(userIdentity, password, done) {
      Customer.findOneWithPassword(userIdentity,function(err, user){
          if (err) { return done(err); }
          if (!user) {
              return done(null, false, { message: 'Incorrect userIdentity.' });
          }
          if (user.password!=password) {
              return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
      });
    }
  ));



// used to serialize the user for the session.
  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

// used to deserialize the user
  passport.deserializeUser(function(id, cb) {
    Customer.findOneById(id, function (err, user) {
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

// expose this function to our app using module.exports
module.exports = new Authorize();
