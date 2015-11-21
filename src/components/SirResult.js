import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CircularProgress from 'material-ui/lib/circular-progress';
import React, {PropTypes as t} from 'react';

import {getCompareURL, repoName} from '../utils/github';

/**
 * A single result from the SIR API.
 */
export default class SirResult extends React.Component {
  static propTypes = {
    username: t.string.isRequired,
    repo: t.string.isRequired,
    shouldRelease: t.bool,
    latestTag: t.string,
    aheadBy: t.number,
    loading: t.bool
  }
  static defaultProps = {
    loading: false
  }
  render() {
    const {username, repo, shouldRelease, aheadBy, latestTag} = this.props;
    const yesOrNo = shouldRelease ? 'Yes' : 'No';
    const fullRepo = repoName(username, repo, false);
    const compareURL = getCompareURL(username, repo, this.props.latestTag, 'HEAD');

    const subtitle = (
      this.props.aheadBy ?
        <a href={compareURL}>{`${aheadBy} commits since last release (${latestTag})`}</a>
      :
        'Nothing to release (last release is the same as HEAD)'
    );
    const title = (
      <span>
        <a href={`https://github.com/${fullRepo}/`}>{fullRepo}</a>&nbsp; - &nbsp;
        <span className={shouldRelease ? 'text-success' : ''}>{yesOrNo}</span>
      </span>
    );
    return (
      <Card>
        {this.props.loading ?
          <CircularProgress size={0.5} /> :
          <CardTitle title={title} subtitle={subtitle} />}
      </Card>
    );
  }
}
