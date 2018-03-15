import 'babel-polyfill';
import createTypes from './createTypes';
import createActions from './createActions';
import createRootSaga from './createRootSaga';
import createRootReducer from './createRootReducer';
import { ucfirst } from './utils/index';

/**
 *
 *
 * @param {Object} A config object that has the following properties
 * @namespace
 * @property {name}
 * @property {http}
 * @property {custom}
 * @property {types}
 * @property {actions}
 * @property {reducer}
 * @property {sagas}
 * @property {log}
 *
 * @returns {STAR}  returns STAR (Sagas, Types, Actions, Reducer) object
 * @property {rootSaga}: contains all generated and custom sagas
 * @property rootReducer: combines all generated reducers and custom reducers
 * @property types: contains all generated types and custom types
 * @property actions: contains all generated actions and custom actions
 */

export function createStar({
  name,
  http,
  custom,
  initialState: moreInitialState,
  types: moreTypes,
  actions: moreActions,
  reducer,
  sagas: moreSagas,
  log = false
}) {
  if (!name) {
    throw new Error('name config is mandatory');
  }

  if (name && name === '') {
    throw new Error('name cannot be empty');
  }

  const ucFirstName = ucfirst(name);

  let defaultHttpObjs = {};
  let addHttpObjs = {};
  let customObjs = {};

  if (http) {
    defaultHttpObjs = {
      [`get${ucFirstName}`]: {
        url: (http.override && http.override[`get${ucFirstName}`].url) || `${http.url}/:id`,
        method: (http.override && http.override[`get${ucFirstName}`].method) || 'get'
      },
      [`get${ucFirstName}s`]: {
        url: (http.override && http.override[`get${ucFirstName}s`].url) || http.url,
        method: (http.override && http.override[`get${ucFirstName}s`].method) || 'get'
      },
      [`post${ucFirstName}`]: {
        url: (http.override && http.override[`post${ucFirstName}`].url) || http.url,
        method: (http.override && http.override[`post${ucFirstName}`].method) || 'post'
      },
      [`patch${ucFirstName}`]: {
        url: (http.override && http.override[`patch${ucFirstName}`].url) || `${http.url}/:id`,
        method: (http.override && http.override[`patch${ucFirstName}`].method) || 'patch'
      },
      [`put${ucFirstName}`]: {
        url: (http.override && http.override[`put${ucFirstName}`].url) || `${http.url}/:id`,
        method: (http.override && http.override[`put${ucFirstName}`].method) || 'put'
      },
      [`delete${ucFirstName}`]: {
        url: (http.override && http.override[`delete${ucFirstName}`].url) || `${http.url}/:id`,
        method: (http.override && http.override[`delete${ucFirstName}`].method) || 'delete'
      }
    };

    if (http.add) {
      addHttpObjs = {
        ...http.add
      };
    }
  }

  if (custom) {
    customObjs = custom;
  }

  const combinedObjs = {
    ...defaultHttpObjs,
    ...addHttpObjs,
    ...customObjs
  };

  const types = createTypes({
    combinedObjs,
    moreTypes
  });

  const actions = createActions({
    types,
    combinedObjs,
    moreActions
  });

  const rootReducer = createRootReducer({
    types,
    combinedObjs,
    moreInitialState,
    reducer
  });

  const rootSaga = createRootSaga({
    types,
    combinedObjs,
    moreSagas,
    log
  });

  return {
    types,
    actions,
    rootReducer,
    rootSaga
  };
}
