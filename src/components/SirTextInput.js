import React, {PropTypes as t} from 'react';
import {Input} from 'react-bootstrap';

const ENTER = 13;

export default class SirTextInput extends React.Component {
  static propTypes = {
    onSave: t.func.isRequired,
    onSaveInvalid: t.func,
    onChange: t.func,
    text: t.string,
    placeholder: t.string,
    help: t.string,
    /**
     * Validation function. May return a boolean or a string (error message)
     */
    isValid: t.func
  }
  static defaultProps = {
    onChange: () => null,
    onSaveInvalid: () => null,
    isValid: () => true
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: this.props.text || '',
    };
  }

  isValid() {
    const isValid = this.props.isValid(this.state.text);
    return isValid && typeof isValid !== 'string';
  }

  handleSubmit(e) {
    const text = e.target.value.trim();
    if (e.which === ENTER) {
      if (this.isValid()) {
        this.props.onSave(text);
        this.setState({text: ''});
      } else {
        // isValid may return a string error message; pass this
        // to onSaveInvalid
        const isValid = this.props.isValid(this.state.text);
        this.props.onSaveInvalid(text, isValid);
      }
    }
  }
  handleChange(e) {
    const text = e.target.value;
    const isValid = this.props.isValid(text);
    this.props.onChange(e);
    this.setState({text, isValid});
  }

  render() {
    return (
      <Input
        type='text'
        bsStyle={this.isValid() ? 'success' : 'error'}
        bsSize='large'
        autoFocus
        help={this.props.help}
        value={this.state.text}
        placeholder={this.props.placeholder}
        onChange={this.handleChange.bind(this)}
        onKeyDown={this.handleSubmit.bind(this)}
      />
    );
  }
}
