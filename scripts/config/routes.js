'use strict';

var path = require('path');
var businessController = require('../controllers/businessController');

var base = path.join(process.cwd(), 'public', 'views');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.join(base, 'landing.html'));
  });
  
  app.get('/profile', (req, res) => {
    req.session.app_user = 'hogdog123'; //just for testing
    res.sendFile(path.join(base, 'profile.html'));
  });

  // APIs
  app.get('/api/retrieve/:location', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'junkdata.json'));
  });
  app.get('/api/get_token', businessController.getToken);
  app.get('/api/this_user', (req, res) => {
    res.send(req.session.app_user);
  });
  app.post('/api/test', (req, res) => {
    console.log(req);
    res.send(req.body);
  })
  app.route('/api/oneBar/:yelp_id')
    .get(businessController.getBar)
    .post(businessController.toggleGoing);
};