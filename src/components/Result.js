import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CircularProgress from 'material-ui/lib/circular-progress';
import React, {PropTypes as t} from 'react';

/**
 * A single result from the SIR API.
 */
export default class Result extends React.Component {
  static propTypes = {
    shouldRelease: t.boolean,
    aheadBy: t.number,
    loading: t.boolean
  }
  static defaultProps = {
    loading: false
  }
  render() {
    const title = this.props.shouldRelease ? 'Yes' : 'No';
    const subtitle = this.props.aheadBy ? `${this.props.aheadBy} commits to release` : 'Nothing to release (last release is the same as HEAD)';
    return (
      <Card>
        {this.props.loading ?  <CircularProgress /> : <CardTitle title={title} subtitle={subtitle} />}
      </Card>
    );
  }
}

