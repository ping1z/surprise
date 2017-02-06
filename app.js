
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
//initialize authorization module
var auth = require('./auth');
auth.init(app);

//initalize router module
var router = require('./router');
app.use('/', router);

app.listen(port, function () {
  console.log('Surprise listening on port 3000!')
})