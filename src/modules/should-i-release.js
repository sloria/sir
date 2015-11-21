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
  error: null,
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
      results: state.results.map((result) => {
        if (repoName(username, repo) === repoName(result.username, result.repo)) {
          return assign({}, result, {
            requestPending: false,
            shouldRelease: response.should_release,
            aheadBy: response.ahead_by,
            latestTag: response.latest_tag
          });
        } else {
          return result;
        }
      })
    });
  },
  [LOAD_FAIL]: (state, {error, username, repo}) => {
    return assign({}, state, {
      results: state.results.map((result) => {
        if (repoName(username, repo) === repoName(result.username, result.repo)) {
          return assign({}, result, { requestPending: false, error: error});
        } else {
          return result;
        }
      })
    });
  }
});


// Actions

function request(username, repo) {
  return {
    type: LOAD,
    payload: {username, repo}
  };
}


function success(username, repo, response) {
  return {
    type: LOAD_SUCCESS,
    payload: {
      username,
      repo,
      response
    }
  };
}

function fail(error, username, repo) {
  return {
    type: LOAD_FAIL,
    payload: {
      error,
      username,
      repo
    }
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
