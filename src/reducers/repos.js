import { createReducer }     from '../utils';
import { COUNTER_INCREMENT } from 'constants/counter';

import {REPOS_REQUEST, REPOS_SUCCESS} from 'constants/repos';

const initialState = {
  requestPending: false,
  repos: []
};
export default createReducer(initialState, {
    [REPOS_REQUEST] : (state) => {
      return Object.assign({}, state, {
        repos: [],
        requestPending: true
      });
    },
    [REPOS_SUCCESS] : (state, payload) => {
      return Object.assign({}, state, {
        requestPending: false,
        repos: payload.repos
      })
    }
});
