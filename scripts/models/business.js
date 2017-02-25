'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var businessSchema = mongoose.Schema({ 
  "yelp_id": {
    type: String,
    required: 'yelp id is required'
  },
  "users_going": [String],
  "total_going": {
    type: Number,
    default: 0
  },
  "last_date": Date
});

module.exports = mongoose.model('Nightlife_business', businessSchema);