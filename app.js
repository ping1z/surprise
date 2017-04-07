var config = require('./config.js');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

//initialize authorization module
var auth = require('./auth');
auth.init(app);

//initalize router module
var router = require('./router');
app.use('/', router);
//initalize admin router module
var routerAdmin = require('./router-admin');
app.use('/', routerAdmin);

app.set('view engine', 'ejs');

app.use('/public', express.static('public'))

app.listen(port, function () {
  console.log('Surprise listening on port 3000!')
})