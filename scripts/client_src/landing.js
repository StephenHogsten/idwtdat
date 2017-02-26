'use strict';

var searchSubmit = document.getElementById('search-btn');
var searchText = document.getElementById('location-search');
searchSubmit.onclick = () => {
  var text = (searchText.value).trim();
  if (!text) {
    // show an error div later
    console.log('no search text');
    return;
  }
  // save the location to the session
  window.location.href = '/location/name/' + text;
}
document.getElementById('location-get').onclick = () => {
  navigator.geolocation.getCurrentPosition( (pos) => {
    window.location.href = '/location/latlon/' + pos.coords.latitude + '/' + pos.coords.longitude;
  }, (err) => {
    // show an error div later
    console.log('location denied');
  });
};