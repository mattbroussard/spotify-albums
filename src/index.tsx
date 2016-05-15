
import * as React from 'react';
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux';

import configureStore from './configureStore';
import {loadPersistentData, persistIfClean} from "./persist";
import App from "./components/App";

const store = configureStore(loadPersistentData());
store.subscribe(() => {
  persistIfClean(store.getState());
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app-root")
);
