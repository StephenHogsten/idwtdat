( function() {
  const d3 = require('d3-request');
  const React = require('react');
  const ReactDOM = require('react-dom');

  const AllBars = require('./modules/AllBars.js');
  const topNav = require('./modules/topNav.js');

  d3.text('/api/this_user/', (err, user) => {
    if (err) throw err;
    

    topNav(user);
    d3.json('/api/location_data', (err, data) => {
      if (err) throw err;

      ReactDOM.render(
        <AllBars user={user} yelpData={data}/>,
        document.getElementById('react-shell')
      );
    });
  });
})();