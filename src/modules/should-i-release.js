import { createReducer }     from '../utils/redux';
import APIClient from '../utils/APIClient';

const client = new APIClient();

// Action types
const ns = 'sir/should-i-release';
const LOAD = `${ns}/LOAD`;
const LOAD_SUCCESS = `${ns}/LOAD_SUCCESS`;
const LOAD_FAIL = `${ns}/LOAD_FAIL`;

// Reducer

const initialState = {
  requestPending: false,
  shouldRelease: null,
  aheadBy: null,
  error: null
};
export default createReducer(initialState, {
  [LOAD]: (state) => {
    return Object.assign({}, state, {
      requestPending: true
    });
  },
  [LOAD_SUCCESS]: (state, payload) => {
    const resp = payload.response;
    return Object.assign({}, state, {
      requestPending: false,
      shouldRelease: resp.should_release,
      aheadBy: resp.ahead_by
    });
  },
  [LOAD_FAIL]: (state, err) => {
    return Object.assign({}, state, {
      requestPending: false,
      error: err
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

function error(err) {
  return {
    type: LOAD_FAIL,
    payload: err,
    error: true
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
        dispatch(error(err));
      });
  };
}
