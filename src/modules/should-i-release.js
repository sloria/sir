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

const REMOVE = `${ns}/REMOVE`;
const REMOVE_ALL = `${ns}/REMOVE_ALL`;

const REFRESH_START = `${ns}/REFRESH_START`;
const REFRESH_ALL_START = `${ns}/REFRESH_ALL_START`;

const DISMISS_ERROR = `${ns}/DISMISS_ERROR`;

// Reducer

const initialState = {
  error: null,
  // Each result is an object of the form
  // {
  //   username: <string>,
  //   repo: <string>,
  //   shouldRelease: <bool>,
  //   latestTag: <string>,
  //   aheadBy: <bool>,
  //   requestPending: <bool>,
  //   lastUpdated: <Date>
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

/**
 * Find first result that matches the given username and repo
 */
function findResult(results, username, repo) {
  for (let i = 0, len = results.length; i < len; i++) {
    const result = results[i];
    if (repoName(result.username, result.repo, true) === repoName(username, repo, true)) {
      return result;
    }
  }
}

export default createReducer(initialState, {
  [LOAD]: (state, {username, repo}) => {
    const inList = (username && repo && state.results.filter((result) => {
      return repoName(result.username, result.repo) === repoName(username, repo);
    }).length);
    // Add new result if repo isn't in list
    if (!inList) {
      const result = {
        username: username,
        repo: repo,
        aheadBy: null,
        shouldRelease: null,
        requestPending: true,
        latestTag: null,
        lastUpdated: null
      };
      return assign({}, state, {
        results: [
          result,
          ...state.results
        ]
      });
    } else {
      // Move the existing result in front of all the others
      const oldResult = findResult(state.results, username, repo);
      const rest = state.results.filter((result) => {
        return repoName(result.username, result.repo, true) !== repoName(username, repo, true);
      });
      // Also set requestPending to true
      const newResults = [
        assign({}, oldResult, {requestPending: true}),
        ...rest
      ];
      return assign({}, state, {
        results: newResults
      });
    }
  },
  [LOAD_SUCCESS]: (state, {username, repo, response}) => {
    return assign({}, state, {
      results: updatedResults(state.results, username, repo,
        {
          requestPending: false,
          shouldRelease: response.should_release,
          aheadBy: response.ahead_by,
          latestTag: response.latest_tag,
          lastUpdated: new Date()
        }
      )
    });
  },
  [LOAD_FAIL]: (state, {error, username, repo}) => {
    return assign({}, state, {
      error: {
        error,
        username,
        repo
      },
      // Remove result that errored
      results: state.results.filter((result) => {
        return repoName(username, repo, true) !== repoName(result.username, result.repo, true);
      })
    });
  },
  [REMOVE]: (state, {username, repo}) => {
    return assign({}, state, {
      results: state.results.filter((result) => {
        return repoName(username, repo, true) !== repoName(result.username, result.repo, true);
      })
    });
  },
  [DISMISS_ERROR]: (state) => {
    return assign({}, state, {
      error: null
    });
  },
  [REMOVE_ALL]: (state) => {
    return assign({}, state, {
      results: [],
      error: null
    });
  },
  [REFRESH_START]: (state, {username, repo}) => {
    return assign({}, state, {
      results: updatedResults(state.results, username, repo, {
        requestPending: true,
      })
    });
  },
  [REFRESH_ALL_START]: (state) => { return state; }
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

function refreshStart(username, repo) {
  return {type: REFRESH_START, payload: {username, repo}};
}

export function refresh(username, repo) {
  return (dispatch) => {
    dispatch(refreshStart(username, repo));
    client.get(`/should_i_release/${username}/${repo}/`)
      .then((res) => {
        dispatch(success(username, repo, res));
      })
      .catch((err) => {
        dispatch(fail(err, username, repo));
      });
  };
}

export function remove(username, repo) {
  return {
    type: REMOVE, payload: {username, repo}
  };
}

export function removeAll() {
  return {type: REMOVE_ALL};
}

export function dismissError() {
  return {type: DISMISS_ERROR};
}


function refreshAllStart() {
  return {type: REFRESH_ALL_START};
}

export function refreshAll() {
  return (dispatch, getState) => {
    dispatch(refreshAllStart());
    const {shouldIRelease} = getState();
    const {results} = shouldIRelease;
    results.forEach((result) => {
      dispatch(refresh(result.username, result.repo));
    });
  };
}
