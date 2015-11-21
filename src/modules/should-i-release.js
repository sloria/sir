import { createReducer }     from '../utils/redux';
import APIClient from '../utils/APIClient';
import {repoName} from '../utils/github';

const assign = Object.assign;

const client = new APIClient();

// Action types
const ns = 'sir/should-i-release';
const LOAD = `${ns}/LOAD`;
const LOAD_SUCCESS = `${ns}/LOAD_SUCCESS`;
const LOAD_FAIL = `${ns}/LOAD_FAIL`;

// Reducer

const initialState = {
  // Each result is an object of the form
  // {
  //   username: <string>,
  //   repo: <string>,
  //   shouldRelease: <bool>,
  //   latestTag: <string>,
  //   aheadBy: <bool>,
  //   requestPending: <bool>
  //   error: <Error or null>
  // }
  results: []
};

/**
 * Helper to return an updated array of SIR results.
 * Does not modify results in-place.
 *
 * @return array Array of updated results
 */
function updatedResults(oldResults, username, repo, data) {
  return oldResults.map((result) => {
    // Use repo name as unique identifier
    if (repoName(username, repo, true) === repoName(result.username, result.repo, true)) {
      return assign({}, result, data);
    } else {
      return result;
    }
  });
}

export default createReducer(initialState, {
  [LOAD]: (state, {username, repo}) => {
    const result = {
      username: username,
      repo: repo,
      aheadBy: null,
      shouldRelease: null,
      requestPending: true,
      latestTag: null,
      error: null
    };
    return assign({}, state, {
      results: [
        result,
        ...state.results
      ]
    });
  },
  [LOAD_SUCCESS]: (state, {username, repo, response}) => {
    return assign({}, state, {
      results: updatedResults(state.results, username, repo,
        {
          requestPending: false,
          shouldRelease: response.should_release,
          aheadBy: response.ahead_by,
          latestTag: response.latest_tag
        }
      )
    });
  },
  [LOAD_FAIL]: (state, {error, username, repo}) => {
    return assign({}, state, {
      results: updatedResults(state.results, username, repo,
        {requestPending: false, error: error}
      )
    });
  }
});


// Actions

function request(username, repo) {
  return {
    type: LOAD, payload: {username, repo}
  };
}


function success(username, repo, response) {
  return {
    type: LOAD_SUCCESS, payload: {username, repo, response}
  };
}

function fail(error, username, repo) {
  return {
    type: LOAD_FAIL, payload: {error, username, repo}
  };
}

export function fetch(username, repo) {
  return (dispatch) => {
    dispatch(request(username, repo));
    client.get(`/should_i_release/${username}/${repo}/`)
      .then((res) => {
        dispatch(success(username, repo, res));
      })
      .catch((err) => {
        dispatch(fail(err, username, repo));
      });
  };
}
