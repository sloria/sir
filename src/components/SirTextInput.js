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

  handleSubmit(e) {
    const text = e.target.value.trim();
    if (e.which === ENTER) {
      const isValid = this.props.isValid(text);
      if (isValid && typeof isValid !== 'string') {
        this.props.onSave(text);
        this.setState({text: ''});
      } else {
        this.props.onSaveInvalid(text, isValid);
      }
    }
  }

  handleChange(e) {
    const text = e.target.value;
    const isValid = this.props.isValid(text)
    this.props.onChange(e);
    this.setState({text, isValid});
  }

  render() {
    return (
      <Input
        type='text'
        bsStyle={this.props.isValid ? 'success' : 'error'}
        bsSize='large'
        autoFocus='true'
        help={this.props.help}
        value={this.state.text}
        onChange={this.props.onChange}
        placeholder={this.props.placeholder}
        onChange={this.handleChange.bind(this)}
        onKeyDown={this.handleSubmit.bind(this)}
      />
    );
  }
}
