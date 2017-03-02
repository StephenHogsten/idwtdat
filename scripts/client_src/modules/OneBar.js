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
  makeUserGoing() {
    if (this.props.showUserGoing) {
      return (
        <div 
          className={this.props.userGoing? "user-going": "user-not-going"}
          key="user-going"
          onClick={this.props.toggleFn}
        >
          {"You are " + (this.props.userGoing? "GOING": "NOT GOING")}
          
        </div>
      );
    } else {
      return;
    }
  }
  render() {
    return (
      <div 
        className="one-bar col-md-5 col-sm-5 col-xs-12"
        style={{backgroundImage: 'url(' + this.props.image + ')'}}
        >
        <div className="bar-fade" key="bar-fade"></div>
        <div className="bar-info-container" key="bar-info">
          <div className="bar-title" key="bar-title">{this.props.title}</div>
          <div className="stars" key="stars">{this.makeStars()}</div>
          {/*<span className="bar-subtitle" key="bar-subtitle">{this.props.snippet}</span>*/}
          <span className="going-count" key="going-count">{'total going: ' + this.props.countGoing}</span>
          {this.makeUserGoing()}
        </div>
      </div>
    )
  }
}

module.exports = OneBar;