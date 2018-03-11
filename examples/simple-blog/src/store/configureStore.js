import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import * as BlogItems from '../stars/blogItems';
import * as Comments from '../stars/comments';
import * as Navigation from '../stars/navigation';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

const appReducer = combineReducers({
  blogItems: BlogItems.rootReducer,
  comments: Comments.rootReducer,
  navigation: Navigation.rootReducer
});

function* rootSaga() {
  yield fork(BlogItems.rootSaga);
  yield fork(Comments.rootSaga);
  yield fork(BlogItems.CustomStar.rootSaga);
}

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

export default function configureStore() {
  const store = createStore(appReducer, {}, enhancer);
  sagaMiddleware.run(rootSaga);
  return store;
}
