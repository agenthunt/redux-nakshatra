import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import * as MediaPlayer from '../stars/mediaPlayer';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const sagaMiddleware = createSagaMiddleware({
  onError: error => {
    console.log('sagaerror', error);
  }
});
const middlewares = [sagaMiddleware];

const appReducer = combineReducers({
  mediaPlayer: MediaPlayer.rootReducer
});

function* rootSaga(args) {
  yield fork(MediaPlayer.rootSaga, args);
}

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

export default function configureStore() {
  const store = createStore(appReducer, {}, enhancer);
  sagaMiddleware.run(rootSaga, store.dispatch);
  return store;
}
