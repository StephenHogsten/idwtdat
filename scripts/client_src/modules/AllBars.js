'use strict';

const React = require('react');
const OneBar = require('./OneBar.js');

class AllBars extends React.Component {
  constructor(props) {
    super(props);
    var allRows = [];
    let bar, row;
    if (!props.yelpData) { console.log('no yelp data found'); return; }   // probably should handle better
    if (!props.yelpData.businesses) { console.log('no businesses found'); return; }   // probably should handle better
    let businesses = props.yelpData.businesses.filter((vals) => !vals['is_closed']);
    if (!businesses) {console.log('no open businesses'); return; }
    for (var i=0, l=Math.min(businesses.length, 20); i<l; i++) {
      bar = {
        title: businesses[i]['name'],
        image: businesses[i]['image_url'],
        rating: businesses[i]['rating'],
        snippet: businesses[i]['snippet_text'],
        url: businesses[i]['url'],
        'react_key': i
      };
      // pull bar's counts from db, or create one if we don't find it
      //  for now just set them randomly
      bar.count = Math.floor(10 * Math.random());
      bar['this_user'] = Math.random() > 0.5? true: false;

      // add to array for state
      if (i%2 === 0) {
        row = [bar];
      } else {
        row.push(bar);
        allRows.push(row);
      }
    }
    if (i%2 !== 0) { allRows.push(row); }

    this.state = {
      bars: allRows
    };
  }

  renderRow(row, idx) {
    return (
      <div className="row" key={idx}>
        {row.map((bar) => this.renderBar(bar))}
      </div>
    );
  }
  renderBar(barObj) {
    return (
      <OneBar
        title={barObj.title}
        image={barObj.image}
        rating={barObj.rating}
        snippet={barObj.snippet}
        url={barObj.url}
        countGoing={barObj.count}
        userGoing={barObj['this_user']}
        key={barObj['react_key']}
      />
    );
  }
  render() {
    return (
      <div className={'bars-body container'}>
        {this.state.bars.map((row, idx) => this.renderRow(row, idx))}
      </div>
    )
  }
}

module.exports = AllBars;
