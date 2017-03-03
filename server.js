'use strict';

require('dotenv').config();
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var path = require('path');

var routes = require('./scripts/config/routes.js');
var passportConfig = require('./scripts/config/passport-config.js');

console.log('me');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) console.log('mongoose connection error: ' + err);
});
 
var app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/client', express.static(path.join(__dirname, 'scripts', 'client')));

var sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
};

if (process.env.ENV_TYPE === 'PRODUCTION') {
  sessionOptions.cookie = { secure: true }
  app.set('trust proxy', 1);
}

app.use(session(sessionOptions));

app.use(bodyParser.urlencoded({extended: false}));

routes(app);

var port = process.env.PORT;
app.listen(port, function() {
  console.log('listening on port ' + port + '...');
});