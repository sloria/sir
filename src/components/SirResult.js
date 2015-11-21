import CircularProgress from 'material-ui/lib/circular-progress';
import React, {PropTypes as t} from 'react';
import {Panel} from 'react-bootstrap';

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
    loading: t.bool,
    children: t.any,
    onDismiss: t.func
  }
  static defaultProps = {
    loading: false
  }
  handleDismiss(e) {
    this.props.onDismiss(e, this.props.username, this.props.repo);
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
      <h3>
        <a href={`https://github.com/${fullRepo}/`}>{fullRepo}</a>&nbsp; - &nbsp;
        <span className={shouldRelease ? 'text-success' : ''}>{yesOrNo}</span>
      </h3>
    );
    return (
      <Panel>
        {
          this.props.onDismiss ?
          <button type='button'
            onClick={this.handleDismiss.bind(this)}
            type='button' className='close' aria-hidden='true' aria-label='Close'>
            <span>&times;</span>
          </button> : ''
        }
        {this.props.loading ?  <CircularProgress size={0.5} /> :
          (<span>
            {title}
            <span className='text-muted'>
              {subtitle}
            </span>
            {this.props.children}
          </span>)
        }
      </Panel>
    );
  }
}
