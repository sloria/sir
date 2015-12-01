import {Button} from 'react-bootstrap';
import React, {PropTypes as t} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from 'modules/should-i-release';
import {SirResult, SirTextInput, ResponseError} from '../components';
import {repoName, validateRepoName} from '../utils/github';

// We define mapStateToProps and mapDispatchToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  shouldIRelease: state.shouldIRelease
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export class HomeView extends React.Component {
  static propTypes = {
    actions: t.object,
    shouldIRelease: t.object
  }
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: ''
    };
  }
  handleSave(text) {
    if (!text) { return; }
    const [username, repo] = text.split('/');
    this.props.actions.fetch(username.trim(), repo.trim());
  }
  handleDismiss(e, username, repo) {
    this.props.actions.remove(username, repo);
  }
  handleChange() {
    if (this.props.shouldIRelease.error) {
      this.props.actions.dismissError();
    }
    this.setState({errorMessage: ''});
  }
  validate(text) {
    if (text && !validateRepoName(text)) {
      return 'Invalid repo name';
    }
    return true;
  }
  renderActionButtons() {
    return (
      <div className='pull-right'>
        <Button onClick={this.props.actions.refreshAll}>Refresh All</Button>
        <Button onClick={this.props.actions.removeAll}>Clear All</Button>
      </div>
    );
  }
  render() {
    const sirData = this.props.shouldIRelease;
    return (
      <div className='container'>

        <div className='row'>
          <div className='col-lg-12'>
            <h1>Should I release?</h1>
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-12'>
            <form onSubmit={(e) => e.preventDefault()}>
              <SirTextInput
                onSave={this.handleSave.bind(this)}
                onChange={this.handleChange.bind(this)}
                onSaveInvalid={(text, msg) => this.setState({errorMessage: msg})}
                isValid={this.validate.bind(this)}
                help={this.state.errorMessage}
                placeholder='Type a GitHub repo and press Enter' />

              {
                sirData.error ?
                <ResponseError username={sirData.error.username}
                  repo={sirData.error.repo}
                  response={sirData.error.error.response} /> : ''
              }
            </form>
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-12'>
            <ul style={{listStyle: 'none', paddingLeft: 0}}>
              {sirData.results.map((result) => {
                return (
                  <li key={repoName(result.username, result.repo, true)} style={{marginTop: '8px'}}>
                    <SirResult
                      username={result.username}
                      repo={result.repo}
                      latestTag={result.latestTag}
                      loading={result.requestPending}
                      lastUpdated={result.lastUpdated}
                      shouldRelease={result.shouldRelease}
                      aheadBy={result.aheadBy}
                      onRefresh={() => {this.props.actions.refresh(result.username, result.repo);}}
                      onDismiss={this.handleDismiss.bind(this)} />
                  </li>
                );
              })}
            </ul>
          </div>
          {sirData.results.length ? this.renderActionButtons() : ''}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
