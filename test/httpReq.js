var assert = require('assert');
var crypto = require('crypto');
var httpReq = require('../scripts/controllers/httpReq.js');

var baseUrl = 'https://api.twitter.com/1/statuses/update.json';
var query = 'include_entities=true&status=Hello%20Ladies%20%2b%20Gentlemen%2c%20a%20signed%20OAuth%20request%21';
var fullUrl = baseUrl + '?' + query;
function getAuth() { 
  return {
    oauth_consumer_key:	"xvz1evFS4wEEPTGEFPHBog",
    oauth_nonce:	"kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg",
    oauth_signature_method:	"HMAC-SHA1",
    oauth_timestamp:	"1318622958",
    oauth_token:	"370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
    oauth_version:	"1.0"
  };
}
var secretArr = [
  'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw',
  'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
];


var paramStr, baseStr, secretStr, signedOptions;

var realParamStr = 'include_entities=true&oauth_consumer_key=xvz1evFS4wEEPTGEFPHBog&oauth_nonce=kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1318622958&oauth_token=370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb&oauth_version=1.0&status=Hello%20Ladies%20%2B%20Gentlemen%2C%20a%20signed%20OAuth%20request%21';
var realBaseStr = 'POST&https%3A%2F%2Fapi.twitter.com%2F1%2Fstatuses%2Fupdate.json&include_entities%3Dtrue%26oauth_consumer_key%3Dxvz1evFS4wEEPTGEFPHBog%26oauth_nonce%3DkYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1318622958%26oauth_token%3D370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb%26oauth_version%3D1.0%26status%3DHello%2520Ladies%2520%252B%2520Gentlemen%252C%2520a%2520signed%2520OAuth%2520request%2521';
var realSecretStr = 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE';
var realSignature = 'tnnArxj06cWHq44gCs1OSKk/jLY=';
var realAuthStr = 'OAuth oauth_consumer_key="xvz1evFS4wEEPTGEFPHBog", oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg", oauth_signature="tnnArxj06cWHq44gCs1OSKk%2FjLY%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1318622958", oauth_token="370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb", oauth_version="1.0"';

describe('httpReq', () => {
  describe('#encodeRUI3986', () => {
    it('should percent encode a string (including !)', function() {
      assert.equal(
        httpReq.encode('Hello Ladies + Gentlemen, a signed OAuth request!'),
        'Hello%20Ladies%20%2B%20Gentlemen%2C%20a%20signed%20OAuth%20request%21'
      );
    });
  });
  describe('#collectParams', () => {
    it('should correctly combine oauth parameters', () => {
      paramStr = httpReq.collectParams(getAuth(), query)
      assert.equal(
        paramStr,
        realParamStr
      );
    });
  });
  describe('#makeBaseString', () => {
    it('should correctly combine the base string', () => {
      baseStr = httpReq.makeBaseString('POST', baseUrl, paramStr);
      assert.equal(
        baseStr,
        realBaseStr
      );
    })
  });
  describe('#makeSecret', () => {
    it('should correctly combine the secrets', () => {
      secretStr = httpReq.makeSecret(secretArr);
      assert.equal(
        secretStr,
        realSecretStr
      );
    });
    it('should correctly build a secret with just one token', () => {
      assert.equal(
        httpReq.makeSecret(['kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw']),
        'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&'
      );
    });
  });
  describe('#makeSignature', () => {
    it('should correctly sign the correct strings', () => {
      assert.equal(httpReq.makeSignature(realBaseStr, realSecretStr), realSignature);
    });
    it('should correctly sign my strings', () => {
      assert.equal(httpReq.makeSignature(baseStr, secretStr), realSignature);
    });
  });
  describe('#signSHA1', () => {
    it('signature returns an options object', () => {
      signedOptions = httpReq.signSHA1('POST', fullUrl, getAuth(), secretArr);
      assert.equal(
        typeof(signedOptions),
        'object'
      );
    });
    it('object returned by signature contains an object in .headers', () => {
      assert.equal( typeof(signedOptions.headers), 'object');
    });
    it('object returned by signature contains a string in .headers.Authorization', () => {
      assert.equal( typeof(signedOptions.headers.Authorization), 'string');
    });
    it('object returned by signature contains correct string in .headers.Authorization', () => {
      assert.equal( signedOptions.headers.Authorization, realAuthStr);
    });
    describe('justReturnSig', () => {
      it('returns only the (correct) signature with the justReturnSig parameter', () => {
        assert.equal(httpReq.signSHA1('POST', fullUrl, getAuth(), secretArr, true), realSignature);
      });
    });
    describe('web/sign-in/implementing test', () => {
      it('returns the correct signature', () => {
        assert.equal(httpReq.signSHA1('POST', 'https://api.twitter.com/oauth/request_token', {
          oauth_callback: "http://localhost/sign-in-with-twitter/",
          oauth_consumer_key: "cChZNFj6T5R0TigYB9yd1w",
          oauth_nonce: "ea9ec8429b68d6b77cd5600adbbb0456",
          oauth_timestamp: "1318467427",
          oauth_version: "1.0"
        }, ['L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg'], true), "F1Li3tvehgcraF8DMJ7OyxO4w9Y=");
      });
      it('returns the correct Authorization value', () => {
        assert.equal(
          httpReq.signSHA1('POST', 'https://api.twitter.com/oauth/request_token', {
            oauth_callback: "http://localhost/sign-in-with-twitter/",
            oauth_consumer_key: "cChZNFj6T5R0TigYB9yd1w",
            oauth_nonce: "ea9ec8429b68d6b77cd5600adbbb0456",
            oauth_timestamp: "1318467427",
            oauth_version: "1.0"
          }, ['L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg']).headers.Authorization, 
          'OAuth oauth_callback="http%3A%2F%2Flocalhost%2Fsign-in-with-twitter%2F", oauth_consumer_key="cChZNFj6T5R0TigYB9yd1w", oauth_nonce="ea9ec8429b68d6b77cd5600adbbb0456", oauth_signature="F1Li3tvehgcraF8DMJ7OyxO4w9Y%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1318467427", oauth_version="1.0"');
      });
    });
  });
});