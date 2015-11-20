import React from 'react';
import {PropTypes as t} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from 'modules/should-i-release';
import {SirResult, SirTextInput, ResponseError} from '../components';
import {repoName} from '../utils/github';

// We define mapStateToProps and mapDispatchToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  shouldIRelease: state.shouldIRelease,
  routerState : state.router
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

function validateRepoName(text) {
  return !text ||  /.+\/.+/.test(text);
}

export class HomeView extends React.Component {
  static propTypes = {
    actions: t.object,
    shouldIRelease: t.object
  }
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: false,
      text: ''
    };
  }
  handleSave(text) {
    const [username, repo] = text.split('/');
    this.props.actions.fetch(username.trim(), repo.trim());
  }
  validate(text) {
    if (!text) {
      return true;
    }
    const [username, repo] = text.split('/');
    const inList = (username && repo && this.props.shouldIRelease.results.filter((result) => {
      return repoName(result.username, result.repo) === repoName(username, repo);
    }).length);
    if (inList) {
      return 'Already in list';
    }
    if (text && !validateRepoName(text)) {
      return 'Invalid repo name';
    }
    return true;
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
                onChange={(e) => this.setState({text: e.target.value})}
                onSaveInvalid={(text, msg) => this.setState({errorMessage: msg})}
                isValid={this.validate.bind(this)}
                placeholder='Type a GitHub repo and press Enter' />
            </form>
            <span className='help-block'>{this.state.errorMessage}</span>
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-12'>
            <ul style={{listStyle: 'none', paddingLeft: 0}}>
              {sirData.results.map((result) => {
                return (
                  <li style={{marginTop: '8px'}}>
                    {
                      result.error ?
                        <ResponseError
                          username={result.username}
                          repo={result.repo}
                          response={result.error.response} />
                      :
                        <SirResult
                          username={result.username}
                          repo={result.repo}
                          loading={result.requestPending}
                          shouldRelease={result.shouldRelease}
                          aheadBy={result.aheadBy} />
                    }
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
