import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import AppScreen from './components/app/appScreen';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';

const store = configureStore();
ReactDOM.render(
  <Provider store={store}>
    <AppScreen />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
