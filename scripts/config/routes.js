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
  app.get('/vanilla', (req, res) => {
    res.sendFile(path.join(base, "landing.html"));
  })
  app.get('/', yelpToken, (req, res) => {
    if (req.session.hasOwnProperty('location')) {
      res.redirect('/profile');
    } else {
      res.redirect('/home');
    }
  });

  app.get('/error/:message', (req, res) => {
    res.json({
      error: decodeURIComponent(req.params.message)
    });
  });
  
  app.get('/profile', yelpToken, (req, res) => {
    res.sendFile(path.join(base, 'profile.html'));
  });

  app.get('/home', yelpToken, (req, res) => {
    res.sendFile(path.join(base, 'landing.html'));
  });

  // not sure if it makes more sense for these to be /API/...
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
  app.get('/api/login_twitter', (req, res, next) => {
    // step 1, get request access token
    var reqUrl = 'https://api.twitter.com/oauth/request_token'
    httpReq.auth(reqUrl, 'POST', {
      oauth_consumer_key: process.env.TWITTER_APP_ID,
      oauth_callback: process.env.URL_BASE + '/api/callback/'
    }, [process.env.TWITTER_APP_SECRET], (err, reqResponse) => {
      if (err) { errorRedirect(res, 'access token request failed'); }
      var reqResponse = querystring.parse(reqResponse);
      console.log(reqResponse);
      if (!reqResponse.oauth_callback_confirmed) { errorRedirect(res, 'access token request failed - oauth_call_confirmed is false'); }
      console.log('step 1 complete');
      // step 2, redirect user
      reqUrl = 'https://api.twitter.com/oauth/authenticate/?oauth_token=' + reqResponse.oauth_token;
      req.session.tmp_request_token = reqResponse.oauth_token;
      // should the secret be stored off under user in DB?
      req.session.tmp_request_token_secret = reqResponse.oauth_token_secret;
      res.redirect(reqUrl);
    });
  });
  app.get('/api/twitter_user', (req, res) => {
    if (!req.session.hasOwnProperty('Twitter')) {
      errorRedirect(res, 'no twitter session info');
      return; 
    }
    httpReq.auth(
      'https://api.twitter.com/1.1/account/verify_credentials.json',
      'GET',
      {
        oauth_consumer_key: process.env.TWITTER_APP_ID,
        oauth_token: req.session.Twitter.oauth_token
      },
      [
        process.env.TWITTER_APP_SECRET,
        req.session.Twitter.oauth_token_secret
      ],
      (err, response) => {
        res.json(JSON.parse(response));
      }
    )
  });
  app.get('/api/this_user', (req, res) => {
    res.send(
      (req.session.hasOwnProperty('Twitter'))? 
      req.session.Twitter.user_id:
      ""
    );
    res.end();
  });
  app.get('/api/callback', (req, res) => {
    if (req.query.oauth_token != req.session.tmp_request_token) {
      errorRedirect(res, 'token does not match');
      return;
    }
    console.log('step 2 complete');
    // step 3, exchange my current keys for actual user keys
    httpReq.auth(
      'https://api.twitter.com/oauth/access_token',
      'POST',
      {
        oauth_consumer_key: process.env.TWITTER_APP_ID,
        oauth_token: req.query.oauth_token,
        oauth_verifier: req.query.oauth_verifier
      },
      [process.env.TWITTER_APP_SECRET],
      (err, finalResponse) => {
        console.log('step 3 complete');
        delete req.session.tmp_request_token;
        delete req.session.tmp_request_token_secret;
        finalResponse = querystring.parse(finalResponse);
        req.session.Twitter = {};
        ['oauth_token', 'oauth_token_secret', 'user_id', 'screen_name'].forEach( (key) => {
          req.session.Twitter[key] = finalResponse[key];
        });
        res.redirect('/api/close_window');
      }
    );
  });
  app.get('/api/close_window', (req, res) => {
    res.sendFile(path.join(base, 'closeWindow.html'));
  });
  app.get('/api/logout', (req, res) => {
    delete req.session.Twitter;
    res.redirect('/');
  })
  app.get('/api/this_session', (req, res) => {
    res.json(req.session);
  });
  app.route('/api/oneBar/:yelp_id')
    .get(businessController.getBar)
    .post(businessController.toggleGoing);
};