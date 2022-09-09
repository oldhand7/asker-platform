const React = require('react');

class UploaderMock extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return <div>
        {this.props.children}
      </div>
    }
}

module.exports = UploaderMock