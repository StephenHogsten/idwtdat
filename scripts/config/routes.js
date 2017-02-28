'use strict';

var path = require('path');
var http = require('http');
var querystring = require('querystring');
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

function errorRedirect(res, message) {
  res.redirect('/error/' + encodeURIComponent(message));
}

module.exports = (app) => {
  app.get('/', yelpToken, (req, res) => {
    res.sendFile(path.join(base, 'landing.html'));
  });

  app.get('/error/:message', (req, res) => {
    res.json({
      error: decodeURIComponent(req.params.message)
    });
  });
  
  app.get('/profile', yelpToken, (req, res) => {
    req.session.app_user = 'hogdog123'; //just for testing
    // console.log(req.session);
    res.sendFile(path.join(base, 'profile.html'));
  });

  app.get('/location/name/:name', (req, res, next) => {
    req.session.location = { name: req.params.name };
    res.redirect('/profile');
  });

  app.get('/location/latlon/:lat/:lon', (req, res, next) => {
    req.session.location = { lat: req.params.lat, lon: req.params.lon };
    res.redirect('/profile');
  });

  // APIs
  app.get('/api/retrieve/:location', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'junkdata.json'));
  });
  app.route('/api/location_data')
    .get((req, res) => {
      if (!req.session) { console.log("req.session not found"); }
      else if (!req.session.location) { console.log("req.session.location not found"); }
      else {
        let url = 'https://api.yelp.com/v3/businesses/search?categories=bars';
        if (req.session.location.name) {
          url += '&location=' + encodeURIComponent(req.session.location.name);
        } else if (req.session.location.lat && req.session.location.lon) {
          url += '&latitude=' + req.session.location.lat;
          url += '&longitude=' + req.session.location.lon;
        }
        httpReq.get(url, req.session.yelp_access_token, (err, response) => {
          res.json(response);
        });
      }
    });
  app.get('/api/get_token', businessController.getToken);
  app.get('/api/test_yelp', yelpToken, (req, res, next) => {
    var url = 'https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972';
    httpReq.get(url, req.session.yelp_access_token, (err, response) => {
      res.json(response);
    });
  });
  app.get('/api/test_twitter', (req, res, next) => {
    // step 1, get request access token
    var reqUrl = 'https://api.twitter.com/oauth/request_token'
    httpReq.auth(reqUrl, 'POST', {
      oauth_consumer_key: process.env.TWITTER_APP_ID,
      oauth_callback: 'http://127.0.0.1:3000/api/callback/'
    }, [process.env.TWITTER_APP_SECRET], (err, reqResponse) => {
      if (err) { errorRedirect(res, 'access token request failed'); }
      var reqResponse = querystring.parse(reqResponse);
      console.log(reqResponse);
      if (!reqResponse.oauth_callback_confirmed) { errorRedirect(res, 'access token request failed - oauth_call_confirmed is false'); }
      console.log('step 1 complete');
      // step 2, redirect user
      reqUrl = 'https://api.twitter.com/oauth/authenticate/?oauth_token=' + reqResponse.oauth_token;
      console.log('reqUrl: '+ reqUrl);
      httpReq.auth(reqUrl, 'POST', {
        oauth_consumer_key: process.env.TWITTER_APP_ID,
        oauth_callback: 'http://127.0.0.1:3000/api/callback/',
        oauth_token: reqResponse.oauth_token,
        oauth_callback_confirmed: reqResponse.oauth_callback_confirmed
      }, [process.env.TWITTER_APP_SECRET, reqResponse.oauth_token_secret], (err, redirResponse) => {
        console.log('should have redirected...');
        console.log(redirResponse);
        res.send(redirResponse);
      });
    });
  });
  app.get('/api/callback', (req, res) => {
    console.log(req.query);
    res.json(req.query);
  });
  app.get('/api/this_user', (req, res) => {
    res.send(req.session.app_user);
  });
  app.post('/api/test', (req, res) => {
    res.send(req.body);
  })
  app.route('/api/oneBar/:yelp_id')
    .get(businessController.getBar)
    .post(businessController.toggleGoing);
};