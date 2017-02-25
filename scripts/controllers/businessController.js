'use strict';

const Business = require('../models/business.js');

module.exports = {
  getBar: function(req, res, next) {
    console.log('this');
    // this will find the bar with the given ID
    //  if the date is too old, it will clear it
    //  if there is no such bar it will create it
    // and then we will return 
    //  the count of users going
    //  whether the current user is going
    Business.findOne({'yelp_id': req.params.id}, (err, doc) => {
      if (err) throw err;

      let now = new Date();
      let empty = {
        'going_count': 0,
        'user_going': false
      };
      console.log('finding');
      now.setHours(0, 0, 0, 0);
      if (doc) {
        console.log(' exists');
        let a = new Date(doc.last_date);
        console.log(a.valueOf());
        console.log(now.valueOf());
        console.log(a.valueOf() == now.valueOf());
        // it exists but we don't know if it's outdated
        if (now.valueOf() == (new Date(doc.last_date)).valueOf()) {
          // we're using today
          console.log('  today');
          console.log(req.session.app_user);
          res.json({
            'going_count': doc.total_going,
            'user_going':  doc.users_going.includes(req.session.app_user)
          });
        } else {
          console.log('  not today');
          // we're wiping out the bar's users
          doc.users_going = [];
          doc.total_going = 0;
          doc.last_date = now;
          doc.save( (err) => { if (err) throw err; });
          res.json(empty);
        }
      } else {
        console.log(' does not exist');
        // create a new yelp doc
        new Business({
          "yelp_id": req.params.id,
          "users_going": [],
          "total_going": 0,
          "last_date": now
        }).save( (err) => { if (err) throw err; });
        res.json(empty);
      }
    });
  }
}