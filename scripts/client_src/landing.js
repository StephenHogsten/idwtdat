'use strict';

( () => {
  const d3 = require('d3-request');

  const topNav = require('./modules/topNav.js');

  function submitLocation() {
    navigator.geolocation.getCurrentPosition( (pos) => {
      window.location.href = '/location/latlon/' + pos.coords.latitude + '/' + pos.coords.longitude;
    }, (err) => {
      // show an error div later
      console.log('location denied');
    });
  }

  function submitText() {
    var text = (searchText.value).trim();
    if (!text) {
      // show an error div later
      console.log('no search text');
      return;
    }
    // save the location to the session
    window.location.href = '/location/name/' + text;
  }

  d3.text('/api/this_user/', (err, user) => {
    if (err) throw err;

    topNav(user, true);
  });
  var searchSubmit = document.getElementById('search-btn');
  var searchText = document.getElementById('location-search');
  searchSubmit.onclick = submitText;
  document.getElementById('location-get').onclick = submitLocation;

  searchText.onfocus = (a, b, c) => {
    searchText.select();
  }
  d3.json('/api/this_session', (err, session) => {
    if (!session.hasOwnProperty('location')) return;
    if (!session.location.hasOwnProperty('name')) return;
    searchText.value = session.location.name;
  });

  document.onkeypress = (event) => {
    if (event.keyCode === 13) {
      submitText();
    }
  };
  
  searchText.focus();
})();