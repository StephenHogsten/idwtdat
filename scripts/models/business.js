'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var businessSchema = mongoose.Schema({ 
  "yelp_id": String,
  "users_going": [String],
  "total_going": Number,
  "last_date": Date
});

module.exports = mongoose.model('Nightlife_business', businessSchema);