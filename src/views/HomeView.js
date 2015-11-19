import React from 'react';
import {PropTypes as t} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from 'modules/should-i-release';
import {Result, ResponseError, SirTextInput} from '../components';

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
  if (text) {
    return /.+\/.+/.test(text);
  } else {
    return true;
  }
}

export class HomeView extends React.Component {
  static propTypes = {
    actions: t.object,
    shouldIRelease: t.object
  }
  constructor(props) {
    super(props)
    this.state = {
      isValid : true,
      showMessage: false
    };
  }
  handleSubmit(text) {
    const [username, repo] = text.split('/');
    if (this.state.isValid) {
      this.props.actions.fetch(username.trim(), repo.trim());
    }
    this.setState({isValid: this.state.isValid, showMessage: true});
  }
  render() {
    const showResult = this.props.shouldIRelease.shouldRelease != null;  //eslint-disable-line
    const shouldRelease = this.props.shouldIRelease.shouldRelease;
    const aheadBy = this.props.shouldIRelease.aheadBy;
    const error = this.props.shouldIRelease.error;
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
                onSave={this.handleSubmit.bind(this)}
                onValid={() => this.setState({isValid: true})}
                onInvalid={() => this.setState({isValid: false})}
                onChange={() => this.setState({showMessage: false})}
                validate={validateRepoName}
                placeholder='Type a GitHub repo and press Enter' />
            </form>
            <span className='help-block'>{this.state.showMessage && !this.state.isValid ? 'Invalid repo name' : ''}</span>
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-12'>
            {error ? <ResponseError repo={this.getInputValue()} response={error.response} /> : ''}
            {showResult ? <Result loading={this.props.shouldIRelease.requestPending} shouldRelease={shouldRelease} aheadBy={aheadBy} /> : ''}
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
