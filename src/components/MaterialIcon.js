import React, {PropTypes as t} from 'react';

// From https://google.github.io/material-design-icons/#icon-font-for-the-web
const sizeMap = {
  sm: '18px',
  md: '24px',
  lg: '36px',
  xl: '48px'
};

export default class MaterialIcon extends React.Component {
  static propTypes = {
    type: t.string.isRequired,
    size: t.string,
    style: t.object
  }
  static defaultProps = {
    size: 'md'
  }
  render() {
    const fontSize = sizeMap[this.props.size];
    const style = Object.assign({}, {fontSize}, this.props.style);
    return (
      <i style={style} className={`mdi-${this.props.type}`}></i>
    );
  }
}
