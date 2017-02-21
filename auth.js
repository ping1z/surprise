var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

// Configuration for passport-local module
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

//bcrypt for passwaord encryption
//var bcrypt = require('bcrypt');

// load up the models we need: CustomerDao model.
var CustomerDao = require("./dao/CustomerDao.js");

// create a new instance
var Customer = new CustomerDao();

// load up the models we need: CustomerDao model.
var AdminDao = require("./dao/AdminDao.js");

// create a new instance
var Admin = new AdminDao();

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
  passport.use("local",new LocalStrategy({
      usernameField: 'userIdentity',
      passwordField: 'password',
    },
    function(userIdentity, password, done) {
      Customer.findOneWithPassword(userIdentity,function(err, user){
          if (err) { return done(err); }
          if (!user) {
              return done(null, false, { message: 'Incorrect userIdentity.' });
          }
          //var match =bcrypt.compareSync(password, user.password); // true 
          //if (!match) {
              //return done(null, false, { message: 'Incorrect password.' });
          //}
          if(password!=user.password){
            return done(null, false, { message: 'Incorrect password.' });
          }
          user.type = "customer";
          return done(null, user);
      });
    }
  ));
  passport.use("local.admin",new LocalStrategy({
      usernameField: 'userIdentity',
      passwordField: 'password',
    },
    function(userIdentity, password, done) {
      Admin.findOneByEmail(userIdentity,function(err, user){
          if (err) { return done(err); }
          if (!user) {
              return done(null, false, { message: 'Incorrect userIdentity.' });
          }
          if(password!=user.password){
            return done(null, false, { message: 'Incorrect password.' });
          }
          user.type = "admin";
          return done(null, user);
      });
    }
  ));

// used to serialize the user for the session.
  passport.serializeUser(function(user, cb) {
    var key = {
      id: user.id,
      type: user.type
    }
    cb(null, key);
  });

// used to deserialize the user
  passport.deserializeUser(function(key, cb) {
    if(key.type === 'admin'){
        Admin.findOneById(key.id, function (err, user) {
          if (err) { return cb(err); }
          user.type = "admin";
          cb(null, user);
        });
    }else if(key.type === 'customer'){
        Customer.findOneById(key.id, function (err, user) {
          if (err) { return cb(err); }
          user.type = "customer";
          cb(null, user);
        });
    }
  });
  console.log("Authorize init.");
}

Authorize.prototype.init = function(app){
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({ secret: 'cs6360', resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());
};
Authorize.prototype.ensureLoggedIn = function(options){
  if (typeof options == 'string') {
    options = { redirectTo: options }
  }
  options = options || {type:"customer"};
  
  var url = options.redirectTo || '/login';
  var setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;
  
  return function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()||req.user.type!=options.type) {
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url;
      }
      return res.redirect(url);
    }
    next();
  }
};

Authorize.prototype.authenticate = function(type, opt){
  return passport.authenticate(type, opt);
};

Authorize.prototype.generateHash = function(password,callback){
  callback && callback(null,password);   
  // bcrypt.hash(password, 10, function(err, hash) {
  //   callback && callback(err,hash);   
  // });
}

// expose this function to our app using module.exports
module.exports = new Authorize();
