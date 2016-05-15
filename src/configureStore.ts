
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import {rootReducer} from './reducers';

export default function configureStore(initialState?) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunkMiddleware),

      // Publish store to devtools extension
      // See: https://github.com/zalmoxisus/redux-devtools-extension
      window["devToolsExtension"] ? window["devToolsExtension"]() : f => f
    )
  );
}
