const d3 = require('d3-request');

module.exports = (user, location) => {
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
};