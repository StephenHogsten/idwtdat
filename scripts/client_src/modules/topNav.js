var d3 = require('d3-request');

module.exports = (user, hideLocation) => {
  let loginBtn = document.getElementById('login-btn');
  if (user) {
    loginBtn.innerText = 'Log out';
    // log them out when clicked
    loginBtn.onclick = () => {
      window.location.pathname = '/api/logout'
    }
    d3.json('/api/this_session', (err, json) => {
      if (json.Twitter && json.Twitter.screen_name) {
        loginBtn.innerText = 'Log Out of ' + json.Twitter.screen_name;
      }
    })
  } else {
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
      liLocation.innerHTML = "<span class='navbar-text'>Location: " + name + " <a href='/home'>(change)</a></span>"
    })
  }
};