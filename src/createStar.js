import 'babel-polyfill';
import createTypes from './createTypes';
import createActions from './createActions';
import createRootSaga from './createRootSaga';
import createRootReducer from './createRootReducer';
import StarTypes from './starTypes';

/**
 *
 *
 * @param {Object} A config object that has the following properties
 * @namespace
 * @property {name}
 * @property {pluralName}
 * @property {url}
 * @property {starType}  Default is StarTypes.REST
 * @property {override}
 * @property {add}
 * @property {types}
 * @property {actions}
 * @property {reducers}
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
  pluralName,
  url,
  starType = StarTypes.REST,
  generateDefault = true,
  override,
  add,
  types: moreTypes,
  actions: moreActions,
  reducers: moreReducers,
  sagas: moreSagas,
  log = false
}) {
  if (generateDefault === true) {
    if (name === undefined || name === null) {
      throw new Error(
        'name can be null or undefined only for generateDefault = false'
      );
    }
  } else {
    name = '';
  }

  if (pluralName === null || pluralName === undefined) {
    pluralName = `${name}s`;
  }

  const types = createTypes({
    name,
    pluralName,
    generateDefault,
    moreTypes,
    add
  });

  const actions = createActions({
    name,
    pluralName,
    types,
    generateDefault,
    moreActions,
    add
  });

  const rootReducer = createRootReducer({
    name,
    pluralName,
    types,
    generateDefault,
    moreReducers,
    add
  });

  const rootSaga = createRootSaga({
    name,
    pluralName,
    types,
    url,
    override,
    add,
    generateDefault,
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
