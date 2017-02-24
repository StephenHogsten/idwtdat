'use strict';

var path = require('path');
var base = path.join(process.cwd(), 'public', 'views');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.join(base, 'landing.html'));
  });
  
  app.get('/profile', (req, res) => {
    res.sendFile(path.join(base, 'profile.html'));
  });

  // APIs
  app.get('/api/retrieve/:location', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'junkdata.json'));
  });
};