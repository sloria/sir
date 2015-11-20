import React, {PropTypes as t} from 'react';
import {Input} from 'react-bootstrap';

const ENTER = 13;

export default class SirTextInput extends React.Component {
  static propTypes = {
    onSave: t.func.isRequired,
    onSaveInvalid: t.func,
    validate: t.func,
    onValid: t.func,
    onInvalid: t.func,
    onChange: t.func,
    onValid: t.func,
    text: t.string,
    placeholder: t.string
  }
  static defaultProps = {
    validate: () => true,
    onSaveInvalid: () => null,
    onInvalid: () => null,
    onValid: () => null
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: this.props.text || '',
      isValid: true
    };
  }

  handleSubmit(e) {
    const text = e.target.value.trim();
    if (e.which === ENTER) {
      if (this.state.isValid) {
        this.props.onSave(text);
        this.setState({ text: '' });
      } else {
        this.props.onSaveInvalid(text);
      }
    }
  }

  handleChange(e) {
    const text = e.target.value;
    let isValid = false;
    if (this.props.validate(text)) {
      isValid = true;
      this.props.onValid(text);
    } else {
      this.props.onInvalid(text);
    }
    this.props.onChange(e);
    this.setState({text, isValid});
  }

  render() {
    return (
      <Input
        type='text'
        bsStyle={this.state.isValid ? 'success' : 'error'}
        bsSize='large'
        autoFocus='true'
        value={this.state.text}
        onChange={this.props.onChange}
        placeholder={this.props.placeholder}
        onChange={this.handleChange.bind(this)}
        onKeyDown={this.handleSubmit.bind(this)}
      />
    );
  }
}
