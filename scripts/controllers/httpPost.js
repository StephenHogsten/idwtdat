'use strict';

const buffer = require('buffer');
const queryString = require('querystring');
const http = require('https');

module.exports = (url, postObj, cb) => {
  console.log(queryString.parse(url));
  let postStr = queryString.stringify(postObj);
  let response = [];
  let options = {
    protocol: 'https:',
    hostname: 'api.yelp.com',
    path: '/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postStr)
    }
  };
  var req = http.request(options, (res) => {
    res.on('data', (chunk) => {
      response.push(chunk.toString());
    });
    res.on('end', () => {
      cb(JSON.parse(response.join('')));
    });
  });

  req.write(postStr);
  req.end();
};