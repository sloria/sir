import React from 'react';
import TestUtils from 'react-addons-test-utils';
const findWithTag = TestUtils.findRenderedDOMComponentWithTag;
const findWithClass = TestUtils.findRenderedDOMComponentWithClass;
const findAllWithClass = TestUtils.scryRenderedDOMComponentsWithClass;

import SirResult from 'components/SirResult';
import {getCompareURL} from 'utils/github';

function renderWithProps(props = {}) {
  return TestUtils.renderIntoDocument(<SirResult {...props} />);
}

describe('(Component) SirResult', () => {
  let _rendered, _props, _spies;

  beforeEach(() => {
    _spies = {
      refresh: sinon.spy(),
      dismiss: sinon.spy()
    };
    _props = {
      username: 'sloria',
      repo: 'ped',
      shouldRelease: true,
      latestTag: '0.1.2',
      aheadby: 3,
      lastUpdated: new Date(),
      loading: false,
      onRefresh: _spies.refresh,
      onDismiss: _spies.dismiss
    };

    _rendered  = renderWithProps(_props);
  });

  it('should include the username and title in an a tag', () => {
    const h3 = findWithTag(_rendered, 'h3');
    assert.match(h3.textContent, /sloria\/ped/);
    assert.match(h3.textContent, /Yes/);
    const atag = h3.getElementsByTagName('a')[0];
    assert.equal(atag.href, 'https://github.com/sloria/ped/');
  });

  it('should include a button to go to the comparison page on GitHub', () => {
    const buttons = findAllWithClass(_rendered, 'btn');
    // First button is "See changes" button
    const seeChangesBtn = buttons[0];
    const compareURL = getCompareURL(_props.username, _props.repo, _props.latestTag, 'HEAD');
    assert.equal(seeChangesBtn.href, compareURL);
  });

  it('should include a button to refresh the result', () => {
    const buttons = findAllWithClass(_rendered, 'btn');
    // Second button is "Refresh" button
    const refreshBtn = buttons[1];
    TestUtils.Simulate.click(refreshBtn);
    assert.isTrue(_spies.refresh.called);
  });

  it('should have a button to dismiss', () => {
    const button = findWithClass(_rendered, 'close');
    TestUtils.Simulate.click(button);
    assert.isTrue(_spies.dismiss.called);
  });
});
