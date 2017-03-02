'use strict';

const React = require('react');
const d3 = require('d3-request');
const OneBar = require('./OneBar.js');

class AllBars extends React.Component {
  constructor(props) {
    super(props);
    var allRows = [];
    var barDict = {};
    let bar, row;
    
    //edge-y cases
    if (!props.yelpData) { this.noBars('no yelp data found'); return; }   
    if (props.yelpData.hasOwnProperty('error')) { this.noBars(props.yelpData.error.code + ': ' + props.yelpData.error.description); return; }
    if (!props.yelpData.businesses) { this.noBars('no businesses found'); return; }   
    let businesses = props.yelpData.businesses.filter((vals) => !vals['is_closed']);
    if (!businesses) {this.noBars('no open businesses'); return; }

    for (var i=0, l=Math.min(businesses.length, 20); i<l; i++) {
      bar = this.parseBar(businesses[i]);
      barDict[bar.id] = bar;
      this.updateBar(bar);
      // add to array for state
      if (i%2 === 0) { row = [bar]; } 
      else {
        row.push(bar);
        allRows.push(row);
      }
    }
    if (i%2 !== 0) { allRows.push(row); }   // for odd numbers

    this.state = {
      bars: allRows,
      barDict: barDict,
      user: props.user,
      noBarsError: false
    };
  }

  noBars(err_message) {
    console.log(err_message)
    this.state = {
      noBarsError: err_message
    };
  }

  parseBar(yelpData) {
    // parse data from this yelp node
    let bar = {
      title: yelpData['name'],
      image: yelpData['image_url'],
      rating: yelpData['rating'],
      snippet: yelpData['snippet_text'],
      url: yelpData['url'],
      id: yelpData['id'],
      countGoing: 0,        // placeholders while we wait for async
      userGoing: false
    };
    return bar;
  }

  updateBar(bar) {
    d3.json('/api/oneBar/' + encodeURIComponent(bar.id), (err, json) => {
      if (err) {console.log('api error'); throw err;}

      bar.countGoing = json.going_count;
      bar.userGoing = json.user_going;    
      //hopefully changing the object in the array will be recognized properly
      this.forceUpdate();
    });
  }

  toggleUserGoing(yelp_id) {
    let bar = this.state.barDict[yelp_id];
    if (!bar) return;
    bar.userGoing = !bar.userGoing;
    bar.countGoing += (bar.userGoing)? 1: -1;
    this.forceUpdate();
    d3.request('/api/oneBar/' + encodeURIComponent(yelp_id))
      .post(() => {});
  }

  renderRow(row, idx) {
    return (
      <div className="row" key={idx}>
        <div className={"col-sm-1 col-md-1"}></div>
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
        countGoing={barObj.countGoing}
        showUserGoing={this.state.user? true: false}
        userGoing={barObj.userGoing}
        key={barObj.id}
        toggleFn={() => this.toggleUserGoing(barObj.id)}
      />
    );
  }
  render() {
    if (this.state.noBarsError) {
      return (
        <p className='present-message'>{this.state.noBarsError}</p>
      );
    }
    return (
      <div className={'bars-body container'}>
        {this.state.bars.map((row, idx) => this.renderRow(row, idx))}
      </div>
    );
  }
}

module.exports = AllBars;
