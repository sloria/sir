import { createReducer }     from '../utils';
import APIClient from '../utils/APIClient';

const ns = 'rero/repos';

// Action types
const LOAD = `${ns}/LOAD`;
const LOAD_SUCCESS = `${ns}/LOAD_SUCCESS`;


// Reducer

const initialState = {
  requestPending: false,
  repos: []
};
export default createReducer(initialState, {
    [LOAD] : (state) => {
      return Object.assign({}, state, {
        repos: [],
        requestPending: true
      });
    },
    [LOAD_SUCCESS] : (state, payload) => {
      return Object.assign({}, state, {
        requestPending: false,
        repos: payload.repos
      })
    }
});


// Actions

function requestRepos(username) {
  return {
    type: LOAD,
    payload: {username}
  }
}

function receiveRepos(username, repos) {
  return {
    type: LOAD_SUCCESS,
    payload: {
      username,
      repos
    }
  }
}

const client = new APIClient();

export function fetchRepos(username) {
  return (dispatch) => {
    dispatch(requestRepos(username));
    let resp = client.get('/repos/');
    resp.then((res) => {
      console.log(res);
      dispatch(receiveRepos(username, res))
    })
  }
}
