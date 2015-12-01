import { combineReducers }    from 'redux';
import { routerStateReducer } from 'redux-router';

import shouldIRelease from './should-i-release';


export default combineReducers({
  shouldIRelease,
  router: routerStateReducer
});
