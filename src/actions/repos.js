import fetch from 'isomorphic-fetch'

import { REPOS_REQUEST, REPOS_SUCCESS } from 'constants/repos';

function requestRepos(username) {
  return {
    type: REPOS_REQUEST,
    payload: {username}
  }
}

function receiveRepos(username, repos) {
  return {
    type: REPOS_SUCCESS,
    payload: {
      username,
      repos
    }
  }
}


// TODO: Make it real
const fakeData = [
  'sloria/TextBlob',
  'sloria/webargs'
]

function fetchRepos(username) {
  return (dispatch) => {
    dispatch(requestRepos(username));
    setTimeout(() => {
      dispatch(receiveRepos(username, fakeData))
    }, 300);
  }
}

export default {
  requestRepos,
  fetchRepos
};
