'use strict';

const buffer = require('buffer');
const queryString = require('querystring');
const http = require('https');
const url = require('url')

module.exports = {
  post: (queryUrl, postObj, cb) => {
    queryUrl = url.parse(queryUrl);
    let postStr = queryString.stringify(postObj);
    let options = {
      protocol: 'https:',
      hostname: queryUrl.hostname,
      path: queryUrl.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postStr)
      }
    };
    var response = [];
    var req = http.request(options, (res) => {
      res.on('data', (chunk) => {
        response.push(chunk.toString());
      });
      res.on('end', () => {
        cb(null, JSON.parse(response.join('')));
      });
    });

    req.write(postStr);
    req.end();
  },
  get: (queryUrl, authorization, cb) => {
    queryUrl = url.parse(queryUrl);
    let options = {
      protocl: 'https',
      hostname: queryUrl.hostname,
      path: queryUrl.path,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + authorization,
      }
    };
    let response = [];
    var req = http.request(options, (res) => {
      res.on('data', (chunk) => {
        response.push(chunk.toString());
      });
      res.on('end', () => {
        cb(null, JSON.parse(response.join('')));
      });
    });
    req.end();
  }
};