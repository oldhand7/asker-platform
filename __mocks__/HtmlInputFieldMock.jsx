const React = require('react');

class HtmlInputField extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(ev) {
        this.props.onChange(ev.target.value)
    }

    render() {
      return <div>
        <textarea placeholder={this.props.placeholder} value={this.props.value} onChange={this.handleChange} />
        {this.props.error ? <p className="form-error">{this.props.error}</p> : null}
      </div>
    }
}

module.exports = HtmlInputField