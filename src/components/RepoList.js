import React, {PropTypes as t} from 'react';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';


const style = {
  cardList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  }
}

export default class RepoList extends React.Component {
  static propTypes = {
    repos: t.array.isRequired
  }
  makeRepoElem(repo, key) {
    return (
      <li key={key} className='card-list-item'>
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
        <ul style={style.cardList} className='card-list'>
          {this.props.repos.map((repo, i) => {return this.makeRepoElem(repo, i);})}
        </ul>
      </div>
    )
  }
}

