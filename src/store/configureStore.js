import thunk from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import DevTools from 'containers/DevTools';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';

import rootReducer from '../modules/reducer';
import routes from '../routes';

export default function configureStore (initialState, debug = false) {
  let createStoreWithMiddleware;

  const middleware = applyMiddleware(thunk);

  if (debug) {
    createStoreWithMiddleware = compose(
      middleware,
      reduxReactRouter({ routes, createHistory }),
      DevTools.instrument()
    );
  } else {
    createStoreWithMiddleware = compose(
      middleware,
      reduxReactRouter({ routes, createHistory })
    );
  }

  const store = createStoreWithMiddleware(createStore)(
    rootReducer, initialState
  );
  if (module.hot) {
    module.hot.accept('../modules', () => {
      const nextRootReducer = require('../modules/reducer');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
