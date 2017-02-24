'use strict';

let React = require('react');

class OneBar extends React.Component {
  makeStars() {
    let starArr = [];
    let starCnt = 1;
    for (; starCnt < this.props.rating; starCnt++) {
      starArr.push(
        <i className={"fa fa-star"} key={starCnt}></i>
      );
    }
    if (starCnt > this.props.rating) { 
      starArr.push(
        <i className={"fa fa-star-half-full"} key={starCnt}></i>
      );
      starCnt++;
    }
    for (; starCnt < 6; starCnt++) {
      starArr.push(
        <i className={"fa fa-star-o"} key={starCnt}></i>
      );
    }
    return starArr;
  }
  render() {
    console.log(this.props);
    return (
      <div 
        className={"one-bar col-md-5 col-sm-5 col-xs-10"}
        style={{backgroundImage: this.props.image}}
        >
        <div className="bar-fade" key="bar-fade"></div>
        <div className="bar-info-container" key="bar-info">
          <span className="bar-title" key="bar-title">{this.props.title}</span>
          <span className="stars" key="stars">{this.makeStars()}</span>
          <span className="bar-subtitle" key="bar-subtitle">{this.props.snippet}</span>
          <span className="going-count" key="going-count">{'total going: ' + this.props.countGoing}</span>
          <span className="user-going" key="user-going">{"you are " + (this.props.userGoing?" GOING": "NOT GOING")}</span>
        </div>
      </div>
    )
  }
}

module.exports = OneBar;