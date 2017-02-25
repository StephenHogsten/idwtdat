'use strict';

var path = require('path');
var businessController = require('../controllers/businessController');
var httpReq = require('../controllers/httpReq.js');

var base = path.join(process.cwd(), 'public', 'views');

function yelpToken(req, res, next) {
  if (req.session && !req.session.hasOwnProperty('yelp_access_token')) {
    var yelpObj = {
      grant_type: 'client_credentials',
      client_id: process.env.YELP_APP_ID,
      client_secret: process.env.YELP_APP_SECRET
    };
    httpReq.post('https://api.yelp.com/oauth2/token', yelpObj, (err, response) => {
      if (err) throw err;
      req.session.yelp_access_token = response.access_token;
      next();
    });
  } else {
    next();
  }
}

module.exports = (app) => {
  app.get('/', yelpToken, (req, res) => {
    res.sendFile(path.join(base, 'landing.html'));
  });
  
  app.get('/profile', yelpToken, (req, res) => {
    req.session.app_user = 'hogdog123'; //just for testing
    res.sendFile(path.join(base, 'profile.html'));
  });

  // APIs
  app.get('/api/retrieve/:location', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'junkdata.json'));
  });
  app.get('/api/get_token', businessController.getToken);
  app.get('/api/test_yelp', yelpToken, (req, res, next) => {
    var url = 'https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972';
    httpReq.get(url, req.session.yelp_access_token, (err, response) => {
      res.json(response);
    });
  });
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