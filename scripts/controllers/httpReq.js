'use strict';

const buffer = require('buffer');
const queryString = require('querystring');
const http = require('https');
const url = require('url')
const crypto = require('crypto');

function encodeURI3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

function collectParams(paramsObj, query) {
  if (query) {
    // add url parameters to the params Obj if it's given
    query.split('&').forEach((val) => {
      let keyVal = decodeURIComponent(val).split('=');
      paramsObj[keyVal[0]] = keyVal[1];
    });
  }
  // fill in some oauth values that are always the same
  const defaults = [
    ["oauth_nonce", 1],
    ['oauth_signature_method', 'HMAC-SHA1'],
    ['oauth_timestamp', Math.round( (new Date()).valueOf() / 1000)],
    ['oauth_version', '1.0']
  ];
  defaults.forEach( (val) => {
    if (!paramsObj.hasOwnProperty(val[0])) { paramsObj[val[0]] = val[1]; }
  });
  
  let baseArr = [];
  Object.keys(paramsObj).sort().forEach( (val) => {
    baseArr.push(
      encodeURI3986(val) + '=' + encodeURI3986(paramsObj[val])
    );
  });
  return baseArr.join('&');
}

function makeBaseString(httpMethod, baseUrl, params) {
  return [httpMethod, baseUrl, params].map(encodeURI3986).join('&');
}

function makeSecret(secretArr) {
  return secretArr.map(encodeURI3986).join('&');
}

function signSHA1(method, fullUrl, authParams, secretArr) {
  // returns the http options including signed Authorization header
  const parsedUrl = url.parse(fullUrl);

  const baseUrl = url.resolve(parsedUrl.protocol + '//' + parsedUrl.hostname, parsedUrl.pathname);

  const paramStr = collectParams(authParams, parsedUrl.query)
  const baseStr = makeBaseString(method, baseUrl, paramStr);
  const secret = makeSecret(secretArr);

  // add signature to authorization object
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(baseStr);
  authParams.oauth_signature = hmac.digest('base64');

  // build options to pass into http
  return {
    protocol: parsedUrl.protocol,
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    method: method,
    headers: {
      Authorization: collapseAuthHeader(authParams)
    }
  };
}

function collapseAuthHeader(authParams) {
  const keys = [
    'oauth_consumer_key',
    'oauth_nonce',
    'oauth_signature',
    'oauth_signature_method',
    'oauth_timestamp',
    'oauth_token',
    'oauth_version'
  ];
  let paramArr = [];
  keys.forEach( (key) => {
    paramArr.push(encodeURI3986(key) + '=' + '"' + encodeURI3986(authParams[key]) + '"');
  });
  return 'OAuth ' + paramArr.join(', ');
}

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
      protocol: 'https',
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
  },
  signSHA1: signSHA1
};