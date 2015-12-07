import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import React, {PropTypes as t} from 'react';

import {repoName} from '../utils/github';

const DEFAULT_MESSAGE = 'The SIR service could not be reached at this time. Please try again later.';

/**
 * Render an error response from the SIR API.
 */
export default class ResponseError extends React.Component {
  static propTypes = {
    username: t.string.isRequired,
    repo: t.string.isRequired,
    response: t.object
  }
  render() {
    let text;
    if (!this.props.response) {
      text = DEFAULT_MESSAGE;
    } else {
      switch (this.props.response.status) {
        case 404:
          const fullRepoName = repoName(this.props.username, this.props.repo);
          text = `Could not find repo: ${fullRepoName}`;
          break;
        default:
          text = DEFAULT_MESSAGE;
      }
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
