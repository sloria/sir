import CircularProgress from 'material-ui/lib/circular-progress';
import React, {PropTypes as t} from 'react';
import {Panel, Button} from 'react-bootstrap';
import moment from 'moment';

import {MaterialIcon as Icon} from '../components';
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
    lastUpdated: t.instanceOf(Date),
    loading: t.bool,
    children: t.any,
    onRefresh: t.func,
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
      <h3 style={{marginTop: '3px'}}>
        <a href={`https://github.com/${fullRepo}/`}>{fullRepo}</a>&nbsp; - &nbsp;
        <span className={shouldRelease ? 'text-success' : ''}>{yesOrNo}</span>
      </h3>
    );
    return (
      <Panel style={{marginBottom: '0px'}}>
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
              {!shouldRelease ? <span className='text-muted pull-right'>Last updated {moment(this.props.lastUpdated).fromNow()}</span> : ''}
            </span>
            {shouldRelease ?
              <div>
                <Button className='btn-raised' bsSize='sm' href={compareURL} target='_blank'>
                  <Icon style={{paddingRight: '5px'}} size='sm' type='action-launch' />
                  See changes
                </Button>
                <Button bsSize='sm' bsStyle='link' onClick={this.props.onRefresh}>
                  <Icon size='md' type='action-cached' />
                </Button>
                <span style={{marginTop: '30px'}} className='text-muted pull-right'>Last updated {moment(this.props.lastUpdated).fromNow()}</span>
              </div>
              : ''
            }
          </span>)
        }
      </Panel>
    );
  }
}
