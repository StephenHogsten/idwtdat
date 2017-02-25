const React = require('react');
const ReactDOM = require('react-dom');

class Baddie extends React.Component {
  render() {
    return (
      <h1 className="baddie">{this.props.data.toString()}</h1>
    );
  }
}

ReactDOM.render(
  <Baddie data={[1,2,3,4]}/>,
  document.getElementById('react-shell')
)