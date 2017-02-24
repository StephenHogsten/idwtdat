( function() {
  const d3 = require('d3-request');
  const AllBars = require('./modules/AllBars.js');
  const React = require('react');
  const ReactDOM = require('react-dom');

  d3.json('/api/retrieve/x', (err, data) => {
    if (err) throw err;

    console.log(data);
    ReactDOM.render(
      <AllBars data="blue" yelpData={data}/>,
      document.getElementById('react-shell')
    );
  });
})();