import CardActions from 'material-ui/lib/card/card-actions';
import {Button} from 'react-bootstrap';
import React, {PropTypes as t} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from 'modules/should-i-release';
import {SirResult, SirTextInput, ResponseError, MaterialIcon as Icon} from '../components';
import {getCompareURL, repoName, validateRepoName} from '../utils/github';

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

export class HomeView extends React.Component {
  static propTypes = {
    actions: t.object,
    shouldIRelease: t.object
  }
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      text: ''
    };
  }
  handleSave(text) {
    const [username, repo] = text.split('/');
    this.props.actions.fetch(username.trim(), repo.trim());
  }
  handleDismiss(e, username, repo) {
    this.props.actions.remove(username, repo);
  }
  handleChange(e) {
    if (this.props.shouldIRelease.error) {
      this.props.actions.dismissError();
    }
    this.setState({text: e.target.value, errorMessage: ''});
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
                const compareURL = getCompareURL(result.username, result.repo, result.latestTag, 'HEAD');
                return (
                  <li key={repoName(result.username, result.repo, true)} style={{marginTop: '8px'}}>
                    <SirResult
                      username={result.username}
                      repo={result.repo}
                      latestTag={result.latestTag}
                      loading={result.requestPending}
                      shouldRelease={result.shouldRelease}
                      aheadBy={result.aheadBy}
                      onDismiss={this.handleDismiss.bind(this)}>

                      {result.shouldRelease ?
                        <CardActions>
                          <Button className='btn-raised' bsSize='sm' href={compareURL} target='_blank'>
                            <Icon style={{paddingRight: '5px'}} size='sm' type='action-launch' />
                            See changes
                          </Button>
                          <Button bsSize='sm' bsStyle='default' onClick={() => {this.props.actions.fetch(result.username, result.repo);}}>
                            <Icon size='md' type='action-cached' />
                          </Button>
                        </CardActions>
                        : ''
                      }
                    </SirResult>
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
