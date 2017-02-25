const url = require('url');

console.log(url.parse('https://api.yelp.com/oauth2/token'));

console.log(url.parse('https://api.yelp.com/v3/autocomplete?text=del&latitude=37.786882&longitude=-122.399972'))