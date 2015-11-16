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

export default class IssueList extends React.Component {
  static propTypes = {
    issues: t.array.isRequired
  }
  makeIssueElem(issue, key) {
    return (
      <li key={key} className='card-list-item'>
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
            <ul style={style.cardList} className="card-list">
                {this.props.issues.map((issue, i) => {return this.makeIssueElem(issue, i);})}
            </ul>
        </div>
    );
  }
}

