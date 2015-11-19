import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import React, {PropTypes as t} from 'react';

/**
 * Render an error response from the SIR API.
 */
export default class ResponseError extends React.Component {
  static propTypes = {
    repo: t.string.isRequired,
    response: t.object.isRequired
  }
  render() {
    let text;
    switch (this.props.response.status) {
    case 404:
      text = `Could not find repo: ${this.props.repo}`;
      break;
    default:
      text = 'Sorry, an unexpected error occurred. Please try again later.';
    }
    return (
      <Card>
        <CardText>
          <span className='text-danger'>{text}</span>
        </CardText>
      </Card>
    );
  }
}

