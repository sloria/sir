import React from 'react';
import {PropTypes as t} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Input, ButtonInput} from 'react-bootstrap';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import CardTitle from 'material-ui/lib/card/card-title';

import repoActions from 'actions/repos';

// We define mapStateToProps and mapDispatchToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  repos : state.repos,
  routerState : state.router
});
const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(repoActions, dispatch)
});


// TODO: put in components
class RepoList extends React.Component {
  static propTypes = {
    repos: t.array.isRequired
  }
  makeRepoElem(repo) {
    return (
      <li className='card-list-item'>
        <Card>
          <CardTitle title={repo} subtitle="Last released 3 days ago"/>
        </Card>
      </li>
    );
  }
  render() {
    return (
      <div className="repo-list">
        <h2>It might be time to release these...</h2>
        <ul className='card-list'>
          {this.props.repos.map((repo) => {return this.makeRepoElem(repo);})}
        </ul>
      </div>
    )
  }
}


class IssueList extends React.Component {
  static propTypes = {
    issues: t.array.isRequired
  }
  makeIssueElem(issue) {
    return (
      <li className='card-list-item'>
        <Card>
          <CardTitle title={issue.title} subtitle={issue.repo}/>
        </Card>
      </li>
    );
  }
  render() {
    return (
        <div className="issue-list">
            <h2>These issues may need attention...</h2>
            <ul className="issue-list">
                {this.props.issues.map((issue) => {return this.makeIssueElem(issue);})}
            </ul>
        </div>
    );
  }
}

class Loader extends React.Component {
  render() {
    return (
      <h2 className='text-muted'>Loading. . .</h2>
    )
  }
}

let fakeIssues = [
    {num: 42, title: 'Needs more cowbell', repo: 'sloria/webargs'},
    {num: 24, title: 'Halp', repo: 'sloria/TextBlob'}
]
export class HomeView extends React.Component {
  static propTypes = {
    actions  : t.object,
    repos: t.array
  }
  constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    // TODO: Change the URL
    this.props.actions.fetchRepos(this.getInputValue());
  }
  getInputValue() {
      return this.refs.ghInput.getValue();
  }
  render () {

    let issues = fakeIssues;
    let repoList = this.props.repos.repos;
    return (
      <div className='container'>

        <div className="row">
          <h1>Enter your GitHub username</h1>
        </div>

        <div className="row">
          <form onSubmit={this.handleSubmit}>
              <Input bsSize='large' ref='ghInput' type='text' placeholder='Enter your GitHub username and press Enter' />
          </form>
        </div>

        <div className="row">
          <div className="col-lg-12">
            {this.props.repos.requestPending ? <Loader /> : ''}
            {repoList.length ? <RepoList repos={repoList} /> : ''}
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            {this.props.repos.requestPending ? <Loader /> : ''}
            {issues.length ? <IssueList issues={issues} /> : ''}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
