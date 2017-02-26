(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var searchSubmit = document.getElementById('search-btn');
var searchText = document.getElementById('location-search');
searchSubmit.onclick = function () {
  var text = searchText.value.trim();
  if (!text) {
    // show an error div later
    console.log('no search text');
    return;
  }
  // save the location to the session
  window.location.href = '/location/name/' + text;
};
document.getElementById('location-get').onclick = function () {
  navigator.geolocation.getCurrentPosition(function (pos) {
    window.location.href = '/location/latlon/' + pos.coords.latitude + '/' + pos.coords.longitude;
  }, function (err) {
    // show an error div later
    console.log('location denied');
  });
};

},{}]},{},[1]);
