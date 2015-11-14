import { combineReducers }    from 'redux';
import { routerStateReducer } from 'redux-router';
import counter from './counter';
import repos from './repos';


export default combineReducers({
  repos,
  router: routerStateReducer
});
