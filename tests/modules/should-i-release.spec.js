import {REHYDRATE_COMPLETE} from 'redux-persist/constants';

import reducer from 'modules/should-i-release';
import {
  LOAD, LOAD_SUCCESS, LOAD_FAIL, REMOVE, DISMISS_ERROR,
  REFRESH_START, REMOVE_ALL
} from 'modules/should-i-release';


/**
 * Result factory
 */
function makeResult(username, repo, overrides = {}) {
  const defaults = {
    aheadBy: null, shouldRelease: null, requestPending: true,
    latestTag: null, lastUpdated: null
  };
  return Object.assign({}, defaults, {username, repo}, overrides);
}

describe('(modules) should-i-release reducer', () => {
  it('should handle LOAD by adding a new result if the result is not in list', () => {
    const initialState = {
      error: null,
      results: []
    };

    const action = {type: LOAD, payload: {username: 'sloria', repo: 'ped'}};
    const newState = reducer(initialState, action);
    assert.deepEqual(newState, {
      error: null,
      results: [
        makeResult('sloria', 'ped')
      ]
    });
  });

  it('should handle LOAD by moving existing result to front of list', () => {
    const initialState = {error: null, results: [makeResult('sloria', 'textblob'), makeResult('sloria', 'ped')]};
    const action = {type: LOAD, payload: {username: 'sloria', repo: 'ped'}};

    const newState = reducer(initialState, action);
    assert.deepEqual(newState, {
      error: null,
      results: [
        makeResult('sloria', 'ped'),
        makeResult('sloria', 'textblob')
      ]
    });
  });

  it('should handle LOAD_SUCCESS by updating an existing item', () => {
    const initialState = {error: null, results: [makeResult('sloria', 'ped', {requestPending: true})]};
    const action = {
      type: LOAD_SUCCESS,
      payload: {username: 'sloria', repo: 'ped', response: {
        should_release: true, ahead_by: 2, latest_tag: '1.23.4', lastUpdated: new Date()
      }}
    };

    const newState = reducer(initialState, action);
    const updatedItem = newState.results[0];
    assert.equal(updatedItem.username, 'sloria');
    assert.equal(updatedItem.repo, 'ped');
    assert.isFalse(updatedItem.requestPending);
  });

  it('should handle LOAD_FAIL by removing the result that errored', () => {
    const initialState = {error: null, results: [makeResult('sloria', 'textblob'), makeResult('sloria', 'ped')]};
    const action = {
      type: LOAD_FAIL,
      payload: {
        error: new Error(),
        username: 'sloria',
        repo: 'ped'
      }
    };

    const newState = reducer(initialState, action);
    // Errored result was removed
    assert.equal(newState.results.length, 1);
    // error was set
    assert.equal(newState.error.username, 'sloria');
    assert.equal(newState.error.repo, 'ped');
    assert.instanceOf(newState.error.error, Error);
  });

  it('should handle REMOVE by removing a result', () => {
    const initialState = {error: null, results: [makeResult('sloria', 'textblob'), makeResult('sloria', 'ped')]};
    const action = {
      type: REMOVE,
      payload: {
        username: 'sloria',
        repo: 'ped'
      }
    };

    const newState = reducer(initialState, action);
    assert.equal(newState.results.length, 1);
  });

  it('should handle DISMISS_ERROR by setting error to null', () => {
    const initialState = {error: new Error(), results: []};
    const newState = reducer(initialState, {type: DISMISS_ERROR});
    assert.isNull(newState.error);
  });

  it('should handle REMOVE_ALL by resetting results to an empty array', () => {
    const initialState = {error: null, results: [makeResult('sloria', 'textblob'), makeResult('sloria', 'ped')]};
    const newState = reducer(initialState, {type: REMOVE_ALL});
    assert.deepEqual(newState.results, []);
  });

  it('should handle REFRESH_START by setting a result\'s requestPending value to true', () => {
    const initialState = {
      error: null,
      results: [
        makeResult('sloria', 'textblob', {requestPending: false}),
        makeResult('sloria', 'ped', {requestPending: false})
      ]
    };
    const action = {type: REFRESH_START, payload: {username: 'sloria', repo: 'ped'}};
    const newState = reducer(initialState, action);
    assert.isTrue(newState.results[1].requestPending);
  });

  it('should handle REHYDRATE_COMPLETE by resetting error to null', () => {
    const initialState = {error: new Error(), results: []};
    const action = {type: REHYDRATE_COMPLETE};
    const newState = reducer(initialState, action);
    assert.isNull(newState.error);
  });
});
