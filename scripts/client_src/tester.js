const crypto = require('crypto');
const url = require('url');

var httpReq = require('../controllers/httpReq.js');

var signing = (httpReq.signSHA1(
  'POST', 
  'https://api.twitter.com/1/statuses/update.json?include_entities=true&status=Hello%20Ladies%20%2b%20Gentlemen%2c%20a%20signed%20OAuth%20request%21',
  {
    oauth_consumer_key:	"xvz1evFS4wEEPTGEFPHBog",
    oauth_nonce:	"kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg",
    oauth_signature_method:	"HMAC-SHA1",
    oauth_timestamp:	"1318622958",
    oauth_token:	"370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
    oauth_version:	"1.0"
  },
  [
    'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw',
    'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
  ]
));
console.log(signing);
var match = 'OAuth oauth_consumer_key="xvz1evFS4wEEPTGEFPHBog", oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg", oauth_signature="tnnArxj06cWHq44gCs1OSKk%2FjLY%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1318622958", oauth_token="370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb", oauth_version="1.0"';
console.log();
console.log('theirs');
console.log(match);
console.log();
console.log('mine');
console.log(signing.headers.Authorization);
console.log();
console.log(signing.headers.Authorization == match);




// ( () => {
//   // const secret = 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE';
//   const secretArr = [
//     'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw',  //consumer
//     'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'     //auth token
//   ];
//   const paramsObj = {
//     status:	"Hello Ladies + Gentlemen, a signed OAuth request!",
//     include_entities: true,
//     oauth_consumer_key:	"xvz1evFS4wEEPTGEFPHBog",
//     oauth_nonce:	"kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg",
//     oauth_signature_method:	"HMAC-SHA1",
//     oauth_timestamp:	"1318622958",
//     oauth_token:	"370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
//     oauth_version:	"1.0"
//   }

//   const params = collectParams(paramsObj);
//   const baseString = makeBaseString('POST', 'https://api.twitter.com/1/statuses/update.json', params);
//   const secret = makeSecret(secretArr);

//   const hmac = crypto.createHmac('sha1', secret);

//   hmac.update(baseString);
//   const myString = hmac.digest('base64');
//   const twitString = 'tnnArxj06cWHq44gCs1OSKk/jLY='
//   console.log('');
//   console.log(myString);
//   console.log(myString == twitString);
// });

function encodeURI3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

function collectParams(paramsObj) {
  let baseArr = []
  Object.keys(paramsObj).sort().forEach( (val) => {
    baseArr.push(
      encodeURI3986(val) + '=' + encodeURI3986(paramsObj[val])
    );
  });
  return baseArr.join('&');
}

function makeBaseString(httpMethod, baseUrl, params) {
  if (typeof(params) === 'object') {
    params = collectParams(params);
  }
  return [httpMethod, baseUrl, params].map(encodeURI3986).join('&');
}

function makeSecret(secretArr) {
  return secretArr.map(encodeURIComponent).join('&');
}