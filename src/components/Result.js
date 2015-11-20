import Card from 'material-ui/lib/card/card';
import CardHeader from'material-ui/lib/card/card-header';
import CardTitle from 'material-ui/lib/card/card-title';
import CircularProgress from 'material-ui/lib/circular-progress';
import React, {PropTypes as t} from 'react';

/**
 * A single result from the SIR API.
 */
export default class Result extends React.Component {
  static propTypes = {
    username: t.string.isRequired,
    repo: t.string.isRequired,
    shouldRelease: t.boolean,
    aheadBy: t.number,
    loading: t.boolean
  }
  static defaultProps = {
    loading: false
  }
  render() {
    const username = this.props.username;
    const repo = this.props.repo;
    const yesOrNo = this.props.shouldRelease ? 'Yes' : 'No';
    const fullRepo = `${username.trim().toLowerCase()}/${repo.trim().toLowerCase()}`;
    const title = (
      <span>
        <a href={`https://github.com/${fullRepo}/`}>{fullRepo}</a>&nbsp; - &nbsp;
        <span className={this.props.shouldRelease ? 'text-success' : ''}>{yesOrNo}</span>
      </span>
    );
    const subtitle = this.props.aheadBy ? `${this.props.aheadBy} commits to release` : 'Nothing to release (last release is the same as HEAD)';
    return (
      <Card>
        {this.props.loading ?
          <CircularProgress /> :
          <CardTitle title={title} subtitle={subtitle} />}
      </Card>
    );
  }
}

