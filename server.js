'use strict';

require('dotenv').config();
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

var routes = require('./scripts/config/routes.js');
var passportConfig = require('./scripts/config/passport-config.js');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) console.log('mongoose connection error: ' + err);
});
 
var app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/client', express.static(path.join(__dirname, 'scripts', 'client')));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: false}));

routes(app);

var port = process.env.PORT;
app.listen(port, function() {
  console.log('listening on port ' + port + '...');
});