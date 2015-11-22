import thunk from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import DevTools from 'containers/DevTools';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist';

import rootReducer from '../modules/reducer';
import routes from '../routes';

const PERSISTENT_REDUCERS = [
  'shouldIRelease'
];

export default function configureStore(initialState, debug = false) {
  let createStoreWithMiddleware;

  const thunkMiddleware = applyMiddleware(thunk);

  if (debug) {
    createStoreWithMiddleware = compose(
      autoRehydrate(),
      thunkMiddleware,
      reduxReactRouter({ routes, createHistory }),
      DevTools.instrument()
    );
  } else {
    createStoreWithMiddleware = compose(
      autoRehydrate(),
      thunkMiddleware,
      reduxReactRouter({ routes, createHistory })
    );
  }

  const store = createStoreWithMiddleware(createStore)(
    rootReducer, initialState
  );
  persistStore(store, {whitelist: PERSISTENT_REDUCERS});
  if (module.hot) {
    module.hot.accept('../modules', () => {
      const nextRootReducer = require('../modules/reducer');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
