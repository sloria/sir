import React                  from 'react';
import TestUtils              from 'react-addons-test-utils';
import { bindActionCreators } from 'redux';
import { HomeView }           from 'views/HomeView';

sinon.assert.expose(assert, {prefix: ''});

function shallowRender (component) {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getRenderOutput();
}

function renderWithProps (props = {}) {
  return TestUtils.renderIntoDocument(<HomeView {...props} />);
}

function shallowRenderWithProps (props = {}) {
  return shallowRender(<HomeView {...props} />);
}

function pressEnter(node) {
  TestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
}

describe('(View) Home', () => {
  let _component, _rendered, _props, _spies;

  beforeEach(() => {
    _spies = {};
    _props = {
      actions : bindActionCreators({
        fetch: (_spies.fetch = sinon.spy()),
        refresh: (_spies.refresh = sinon.spy()),
        remove: (_spies.remove = sinon.spy()),
        removeAll: (_spies.removeAll = sinon.spy()),
        refreshAll: (_spies.refreshAll = sinon.spy())
      }, _spies.dispatch = sinon.spy()),
      shouldIRelease: {
        error: null,
        results: []
      }
    };

    _component = shallowRenderWithProps(_props);
    _rendered  = renderWithProps(_props);
  });

  it('should render as a <div>.', () => {
    assert.equal(_component.type, 'div');
  });

  it('should include an <h1> with header text.', () => {
    const h1 = TestUtils.findRenderedDOMComponentWithTag(_rendered, 'h1');
    assert.ok(h1);
    assert.match(h1.textContent, /Should I release?/);
  });

  it('should include an input', () => {
    const input = TestUtils.findRenderedDOMComponentWithTag(_rendered, 'input');
    assert.ok(input);
  });

  it('should dispatch fetch action when input entered', () => {
    const input = TestUtils.findRenderedDOMComponentWithTag(_rendered, 'input');
    input.value = 'rackt/redux';
    TestUtils.Simulate.change(input);
    pressEnter(input);
    assert.isTrue(_spies.fetch.called);
    assert.isTrue(_spies.fetch.calledWith('rackt', 'redux'));
  });
});
