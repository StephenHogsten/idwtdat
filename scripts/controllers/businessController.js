'use strict';

const Business = require('../models/business.js');
const httpReq = require('./httpReq.js');

module.exports = {
  getBar: function(req, res, next) {
    // this will find the bar with the given ID
    //  if the date is too old, it will clear it
    //  if there is no such bar it will create it
    // and then we will return 
    //  the count of users going
    //  whether the current user is going
    Business.findOne({'yelp_id': req.params.yelp_id}, (err, doc) => {
      if (err) throw err;

      let now = new Date();
      now.setHours(0, 0, 0, 0);
      let empty = {
        'going_count': 0,
        'user_going': false
      };
      if (doc) {
        let a = new Date(doc.last_date);
        // it exists but we don't know if it's outdated
        if (now.valueOf() == (new Date(doc.last_date)).valueOf()) {
          // we're using today
          res.json({
            'going_count': doc.total_going,
            'user_going':  doc.users_going.includes(req.session.app_user)
          });
        } else {
          // we're wiping out the bar's users
          doc.users_going = [];
          doc.total_going = 0;
          doc.last_date = now;
          doc.save( (err) => { if (err) throw err; });
          res.json(empty);
        }
      } else {
        // create a new yelp doc
        new Business({
          "yelp_id": req.params.yelp_id,
          "users_going": [],
          "total_going": 0,
          "last_date": now
        }).save( (err) => { if (err) throw err; });
        res.json(empty);
      }
    });
  },
  toggleGoing: function(req, res, next) {
    let user = req.session.app_user;
    if (!user) return;
    Business.findOne({'yelp_id': req.params.yelp_id}, (err, doc) => {
      if (err) throw err;
      
      if (!doc) return;
      let idx = doc.users_going.indexOf(user);
      if (idx === -1) {
        doc.total_going += 1;
        doc.users_going.push(user)
      } else {
        doc.total_going -= 1;
        doc.users_going.splice(idx, 1);
      }
      doc.save( (err) => { if (err) throw err; });
    });
  },
  getToken: function(req, res, next) {
    var yelpObj = {
      grant_type: 'client_credentials',
      client_id: process.env.YELP_APP_ID,
      client_secret: process.env.YELP_APP_SECRET
    };
    httpReq.post('https://api.yelp.com/oauth2/token', yelpObj, (err, response) => {
      res.send(response);
    });
  }
}
  

