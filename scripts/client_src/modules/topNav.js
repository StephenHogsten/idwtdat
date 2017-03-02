var d3 = require('d3-request');

module.exports = (user, hideLocation) => {
  let loginBtn = document.getElementById('login-btn');
  if (user) {
    console.log('we have a user');
    loginBtn.innerHTML = 'Log Out';
    // log them out when clicked
    loginBtn.onclick = () => {
      window.location.pathname = '/api/logout'
    }
  } else {
    console.log('we have no user');
    // log them in when clicked
    loginBtn.onclick = () => {
      window.open('/api/login_twitter');
    };
  }

  var liLocation = document.getElementById('li-location');
  if (hideLocation) {
    liLocation.remove();
  } else {
    // get the location
    d3.json('/api/this_session', (err, json) => {
      if (err) throw err;
      if (!json.hasOwnProperty('location')) return;
      var name;
      if (json.location.hasOwnProperty('name')) {
        name = json.location.name; 
      } else if (json.location.hasOwnProperty('lat')) { 
        name = "current"
      } else {
        return;
      }
      liLocation.innerHTML = "<span class='navbar-text'>Location: " + name + "<a href='/home'>(change)</a></span>"
    })
  }
};